import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'node:crypto';

@Injectable()
export class RateLimiterService {
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

  /**
   * Concurrency-Safe Atomic Check-and-Record.
   * Atomically records a failed attempt ONLY IF the failure limit (< 5 in 15 mins) has not been exceeded.
   * If limit is already reached, the CTE returns 0 rows, signaling an active lockout.
   */
  async recordFailedAttemptAtomic(rawIp: string): Promise<void> {
    const ipHash = this.hashIp(rawIp);

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

    if (result.length === 0) {
      throw new HttpException(
        'Too many failed login attempts. IP temporarily restricted for 15 minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /**
   * Pre-flight Check: Rejects locked-out IPs before executing expensive bcrypt comparisons.
   */
  async assertNotLockedOut(rawIp: string): Promise<void> {
    const ipHash = this.hashIp(rawIp);
    const windowStart = new Date(Date.now() - 15 * 60 * 1000);

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
  }

  async recordSuccess(rawIp: string): Promise<void> {
    const ipHash = this.hashIp(rawIp);
    await this.prisma.loginAttempt.create({
      data: { ipHash, success: true },
    });
  }
}
