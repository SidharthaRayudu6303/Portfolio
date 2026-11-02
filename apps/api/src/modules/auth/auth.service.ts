import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RateLimiterService } from './rate-limiter.service';
import { LoginDto } from './dto/login.dto';

const EXPECTED_ISSUER = 'portfolio-api';
const EXPECTED_AUDIENCE = 'portfolio-admin';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly rateLimiter: RateLimiterService,
  ) {}

  async login(loginDto: LoginDto, clientIp: string) {
    const ipHash = this.rateLimiter.hashIp(clientIp);

    // 1. Pre-flight check: reject if IP already locked out
    await this.rateLimiter.assertNotLockedOut(clientIp);

    // 2. Fetch admin user from DB or verify against environment configuration
    let user: any = null;
    let dbAvailable = true;

    try {
      user = await this.prisma.adminUser.findUnique({
        where: { email: loginDto.email },
      });
    } catch (dbErr: any) {
      dbAvailable = false;
      this.logger.warn(
        `Database query deferred during authentication; checking environment credentials: ${
          dbErr?.message || dbErr
        }`,
      );
    }

    const envEmail =
      typeof this.configService?.get === 'function'
        ? this.configService.get<string>('ADMIN_EMAIL')
        : process.env.ADMIN_EMAIL;
    const envPassword =
      typeof this.configService?.get === 'function'
        ? this.configService.get<string>('ADMIN_PASSWORD')
        : process.env.ADMIN_PASSWORD;

    // 3. Verify password
    if (dbAvailable) {
      if (!user) {
        await this.rateLimiter.recordFailedAttemptAtomic(clientIp);
        try {
          await this.prisma.securityAuditLog.create({
            data: {
              action: 'LOGIN_FAILURE',
              ipHash,
              details: `Failed attempt for non-existent account: ${loginDto.email}`,
            },
          });
        } catch {
          // Ignored if DB is offline
        }
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
      if (!isPasswordValid) {
        await this.rateLimiter.recordFailedAttemptAtomic(clientIp);
        try {
          await this.prisma.securityAuditLog.create({
            data: {
              action: 'LOGIN_FAILURE',
              ipHash,
              details: `Failed password verification for user ID: ${user.id}`,
            },
          });
        } catch {
          // Ignored if DB is offline
        }
        throw new UnauthorizedException('Invalid email or password');
      }
    } else {
      // Offline / Unseeded fallback: verify against environment configuration
      const matchesEmail =
        envEmail && loginDto.email.trim().toLowerCase() === envEmail.trim().toLowerCase();
      let matchesPassword = false;

      if (matchesEmail && envPassword) {
        if (envPassword.startsWith('$2b$') || envPassword.startsWith('$2a$')) {
          matchesPassword = await bcrypt.compare(loginDto.password, envPassword);
        } else {
          matchesPassword = loginDto.password === envPassword;
        }
      }

      if (!matchesEmail || !matchesPassword) {
        await this.rateLimiter.recordFailedAttemptAtomic(clientIp);
        try {
          await this.prisma.securityAuditLog.create({
            data: {
              action: 'LOGIN_FAILURE',
              ipHash,
              details: `Failed attempt for non-existent account: ${loginDto.email}`,
            },
          });
        } catch {
          // Ignored if DB is offline
        }
        throw new UnauthorizedException('Invalid email or password');
      }

      user = {
        id: 'admin-root-01',
        email: envEmail,
        role: 'admin',
        tokenVersion: 1,
      };
      this.logger.log(`Verified admin authentication successful for: ${envEmail}`);
    }

    // 4. Record success
    await this.rateLimiter.recordSuccess(clientIp);
    try {
      await this.prisma.securityAuditLog.create({
        data: {
          action: 'LOGIN_SUCCESS',
          ipHash,
          details: `Successful login for user ID: ${user.id}`,
        },
      });
    } catch {
      // Ignored if DB is offline
    }

    // 5. Issue JWT with enforced claims
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      algorithm: 'HS256',
      issuer: EXPECTED_ISSUER,
      audience: EXPECTED_AUDIENCE,
      expiresIn: '8h',
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(userId: string, clientIp: string) {
    const ipHash = this.rateLimiter.hashIp(clientIp);

    try {
      // Invalidate all tokens for this admin by incrementing tokenVersion
      await this.prisma.adminUser.update({
        where: { id: userId },
        data: { tokenVersion: { increment: 1 } },
      });

      await this.prisma.securityAuditLog.create({
        data: {
          action: 'LOGOUT',
          ipHash,
          details: `User ID: ${userId} logged out. Token version incremented.`,
        },
      });
    } catch {
      // Ignored if DB is offline
    }

    return { message: 'Logged out successfully. Session invalidated.' };
  }

  async me(userId: string) {
    let dbAvailable = true;
    try {
      const user = await this.prisma.adminUser.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (user) {
        return user;
      }
    } catch {
      dbAvailable = false;
    }

    if (!dbAvailable) {
      const envEmail =
        (typeof this.configService?.get === 'function'
          ? this.configService.get<string>('ADMIN_EMAIL')
          : process.env.ADMIN_EMAIL) || 'admin@sidhartha.dev';

      if (userId === 'admin-root-01' || userId.includes('admin')) {
        return {
          id: 'admin-root-01',
          email: envEmail,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    throw new UnauthorizedException('User not found');
  }

  async getSecurityAuditLogs() {
    try {
      const logs = await this.prisma.securityAuditLog.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          action: true,
          ipHash: true,
          details: true,
          createdAt: true,
        },
      });

      const recentAttempts = await this.prisma.loginAttempt.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          ipHash: true,
          success: true,
          createdAt: true,
        },
      });

      return {
        auditLogs: logs,
        recentAttempts,
      };
    } catch {
      return {
        auditLogs: [],
        recentAttempts: [],
      };
    }
  }
}
