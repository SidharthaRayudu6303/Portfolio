import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RateLimiterService } from './rate-limiter.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: any;
  let jwtService: any;
  let rateLimiter: any;

  const mockAdminUser = {
    id: 'admin-123',
    email: 'admin@portfolio.dev',
    passwordHash: 'hashed_password_string',
    role: 'admin',
    tokenVersion: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaService = {
      adminUser: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      securityAuditLog: {
        create: jest.fn().mockResolvedValue({ id: 'audit-log-1' }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      loginAttempt: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock.jwt.token'),
    };

    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue('test-jwt-secret-minimum-32-chars-long!'),
    };

    rateLimiter = {
      hashIp: jest.fn().mockReturnValue('mock-hashed-ip-123'),
      assertNotLockedOut: jest.fn().mockResolvedValue(undefined),
      recordFailedAttemptAtomic: jest.fn().mockResolvedValue(undefined),
      recordSuccess: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: RateLimiterService, useValue: rateLimiter },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully authenticate admin, record success, and return JWT', async () => {
      prismaService.adminUser.findUnique.mockResolvedValue(mockAdminUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(
        { email: 'admin@portfolio.dev', password: 'ValidPassword123!' },
        '127.0.0.1',
      );

      expect(rateLimiter.assertNotLockedOut).toHaveBeenCalledWith('127.0.0.1');
      expect(prismaService.adminUser.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@portfolio.dev' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('ValidPassword123!', mockAdminUser.passwordHash);
      expect(rateLimiter.recordSuccess).toHaveBeenCalledWith('127.0.0.1');
      expect(prismaService.securityAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'LOGIN_SUCCESS' }),
        }),
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: mockAdminUser.id,
          email: mockAdminUser.email,
          role: mockAdminUser.role,
          tokenVersion: mockAdminUser.tokenVersion,
        },
        expect.objectContaining({
          issuer: 'portfolio-api',
          audience: 'portfolio-admin',
          expiresIn: '8h',
        }),
      );
      expect(result).toEqual({
        accessToken: 'mock.jwt.token',
        user: {
          id: mockAdminUser.id,
          email: mockAdminUser.email,
          role: mockAdminUser.role,
        },
      });
    });

    it('should throw UnauthorizedException and record failure if email does not exist', async () => {
      prismaService.adminUser.findUnique.mockResolvedValue(null);

      await expect(
        authService.login(
          { email: 'nonexistent@portfolio.dev', password: 'Password123!' },
          '127.0.0.1',
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(rateLimiter.recordFailedAttemptAtomic).toHaveBeenCalledWith('127.0.0.1');
      expect(prismaService.securityAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'LOGIN_FAILURE',
          }),
        }),
      );
    });

    it('should throw UnauthorizedException and record failure on incorrect password', async () => {
      prismaService.adminUser.findUnique.mockResolvedValue(mockAdminUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login(
          { email: 'admin@portfolio.dev', password: 'WrongPassword!' },
          '127.0.0.1',
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(rateLimiter.recordFailedAttemptAtomic).toHaveBeenCalledWith('127.0.0.1');
      expect(prismaService.securityAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'LOGIN_FAILURE',
          }),
        }),
      );
    });

    it('should reject login immediately when IP is locked out', async () => {
      rateLimiter.assertNotLockedOut.mockRejectedValue(
        new HttpException('Too many failed login attempts.', HttpStatus.TOO_MANY_REQUESTS),
      );

      await expect(
        authService.login(
          { email: 'admin@portfolio.dev', password: 'AnyPassword!' },
          '127.0.0.1',
        ),
      ).rejects.toThrow(HttpException);

      expect(prismaService.adminUser.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should increment tokenVersion and log LOGOUT event to invalidate session', async () => {
      prismaService.adminUser.update.mockResolvedValue({
        ...mockAdminUser,
        tokenVersion: 2,
      });

      const res = await authService.logout('admin-123', '127.0.0.1');

      expect(prismaService.adminUser.update).toHaveBeenCalledWith({
        where: { id: 'admin-123' },
        data: { tokenVersion: { increment: 1 } },
      });
      expect(prismaService.securityAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'LOGOUT' }),
        }),
      );
      expect(res.message).toContain('Logged out successfully');
    });
  });

  describe('me', () => {
    it('should return admin user profile without exposing passwordHash', async () => {
      prismaService.adminUser.findUnique.mockResolvedValue({
        id: 'admin-123',
        email: 'admin@portfolio.dev',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const profile = await authService.me('admin-123');

      expect(profile).toHaveProperty('id', 'admin-123');
      expect(profile).toHaveProperty('email', 'admin@portfolio.dev');
      expect(profile).not.toHaveProperty('passwordHash');
    });

    it('should throw UnauthorizedException if admin user is not found', async () => {
      prismaService.adminUser.findUnique.mockResolvedValue(null);

      await expect(authService.me('deleted-id')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getSecurityAuditLogs', () => {
    it('should retrieve audit logs and recent login attempts', async () => {
      const mockLogs = [{ id: '1', action: 'LOGIN_SUCCESS', ipHash: 'h', createdAt: new Date() }];
      const mockAttempts = [{ id: 'a1', ipHash: 'h', success: true, createdAt: new Date() }];

      prismaService.securityAuditLog.findMany.mockResolvedValue(mockLogs);
      prismaService.loginAttempt.findMany.mockResolvedValue(mockAttempts);

      const result = await authService.getSecurityAuditLogs();

      expect(result.auditLogs).toEqual(mockLogs);
      expect(result.recentAttempts).toEqual(mockAttempts);
    });
  });
});

