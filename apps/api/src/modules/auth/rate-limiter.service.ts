import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'node:crypto';

@Injectable()
export class RateLimiterService {
  private readonly inMemoryAttempts = new Map<string, { count: number; windowStart: number }>();

  constructor(private readonly prisma: PrismaService) {}

  private getSalt(): string {
    const salt = process.env.IP_SALT_SECRET;
    if (!salt || salt.length < 32) {
      throw new Error('FATAL: IP_SALT_SECRET must be configured with at least 32 characters.');
    }
    return salt;
  }

  hashIp(rawIp: string): string {
    return crypto.createHmac('sha256', this.getSalt()).update(rawIp).digest('hex');
  }

  private recordInMemoryFailure(ipHash: string): void {
    const now = Date.now();
    const entry = this.inMemoryAttempts.get(ipHash);
    if (!entry || now - entry.windowStart > 15 * 60 * 1000) {
      this.inMemoryAttempts.set(ipHash, { count: 1, windowStart: now });
    } else {
      entry.count += 1;
      if (entry.count >= 5) {
        throw new HttpException(
          'Too many failed login attempts. IP temporarily restricted for 15 minutes.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
  }

  /**
   * Concurrency-Safe Atomic Check-and-Record.
   * Atomically records a failed attempt ONLY IF the failure limit (< 5 in 15 mins) has not been exceeded.
   * Uses PostgreSQL transaction-level advisory locks (pg_advisory_xact_lock) serialized per IP hash
   * to guarantee that concurrent requests from the same IP cannot race or bypass the lockout threshold.
   */
  async recordFailedAttemptAtomic(rawIp: string): Promise<void> {
    const ipHash = this.hashIp(rawIp);

    try {
      if (typeof this.prisma.$transaction === 'function') {
        await this.prisma.$transaction(async (tx) => {
          // 1. Transaction-level advisory lock on hashed IP (serializes concurrent attempts for this IP)
          await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${ipHash})::bigint);`;

          // 2. Count recent failures under serialized lock
          const countRows = await tx.$queryRaw<Array<{ failure_count: number | bigint }>>`
            SELECT COUNT(*)::int AS failure_count
            FROM "LoginAttempt"
            WHERE "ipHash" = ${ipHash}
              AND "success" = false
              AND "createdAt" >= NOW() - INTERVAL '15 minutes';
          `;
          const failureCount = Number(countRows[0]?.failure_count ?? 0);

          if (failureCount >= 5) {
            throw new HttpException(
              'Too many failed login attempts. IP temporarily restricted for 15 minutes.',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }

          // 3. Atomically insert failed attempt record
          await tx.$executeRaw`
            INSERT INTO "LoginAttempt" ("id", "ipHash", "success", "createdAt")
            VALUES (gen_random_uuid()::text, ${ipHash}, false, NOW());
          `;
        });
        return;
      }
    } catch (err: any) {
      if (err instanceof HttpException) throw err;
      // Resilient fallback when database server is offline or unreachable
      this.recordInMemoryFailure(ipHash);
      return;
    }

    try {
      // Fallback for mocked unit tests or non-transaction environments
      const result = await this.prisma.$queryRaw<Array<{ id: string }>>`
        WITH current_window AS (
          SELECT COUNT(*)::int AS failure_count
          FROM "LoginAttempt"
          WHERE "ipHash" = ${ipHash}
            AND "success" = false
            AND "createdAt" >= NOW() - INTERVAL '15 minutes'
        )
        INSERT INTO "LoginAttempt" ("id", "ipHash", "success", "createdAt")
        SELECT gen_random_uuid()::text, ${ipHash}, false, NOW()
        FROM current_window
        WHERE current_window.failure_count < 5
        RETURNING "id";
      `;

      if (!result || result.length === 0) {
        throw new HttpException(
          'Too many failed login attempts. IP temporarily restricted for 15 minutes.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    } catch (err: any) {
      if (err instanceof HttpException) throw err;
      this.recordInMemoryFailure(ipHash);
    }
  }

  /**
   * Pre-flight Check: Rejects locked-out IPs before executing expensive bcrypt comparisons.
   */
  async assertNotLockedOut(rawIp: string): Promise<void> {
    const ipHash = this.hashIp(rawIp);
    const windowStart = new Date(Date.now() - 15 * 60 * 1000);

    try {
      const count = await this.prisma.loginAttempt.count({
        where: {
          ipHash,
          success: false,
          createdAt: { gte: windowStart },
        },
      });

      if (count >= 5) {
        throw new HttpException(
          'Too many failed login attempts. IP temporarily restricted for 15 minutes.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    } catch (err: any) {
      if (err instanceof HttpException) throw err;
      // Check in-memory attempts if database is offline or unreachable
      const entry = this.inMemoryAttempts.get(ipHash);
      if (entry && Date.now() - entry.windowStart <= 15 * 60 * 1000 && entry.count >= 5) {
        throw new HttpException(
          'Too many failed login attempts. IP temporarily restricted for 15 minutes.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
  }

  async recordSuccess(rawIp: string): Promise<void> {
    const ipHash = this.hashIp(rawIp);
    this.inMemoryAttempts.delete(ipHash);
    try {
      await this.prisma.loginAttempt.create({
        data: { ipHash, success: true },
      });
    } catch {
      // Ignored if database is offline
    }
  }
}
