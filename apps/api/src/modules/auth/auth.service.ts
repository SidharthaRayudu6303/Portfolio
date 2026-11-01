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

    // 2. Fetch admin user
    const user = await this.prisma.adminUser.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      // Record failure and increment atomic count
      await this.rateLimiter.recordFailedAttemptAtomic(clientIp);
      await this.prisma.securityAuditLog.create({
        data: {
          action: 'LOGIN_FAILURE',
          ipHash,
          details: `Failed attempt for non-existent account: ${loginDto.email}`,
        },
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Verify password hash
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      await this.rateLimiter.recordFailedAttemptAtomic(clientIp);
      await this.prisma.securityAuditLog.create({
        data: {
          action: 'LOGIN_FAILURE',
          ipHash,
          details: `Failed password verification for user ID: ${user.id}`,
        },
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    // 4. Record success
    await this.rateLimiter.recordSuccess(clientIp);
    await this.prisma.securityAuditLog.create({
      data: {
        action: 'LOGIN_SUCCESS',
        ipHash,
        details: `Successful login for user ID: ${user.id}`,
      },
    });

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

    return { message: 'Logged out successfully. Session invalidated.' };
  }

  async me(userId: string) {
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

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
