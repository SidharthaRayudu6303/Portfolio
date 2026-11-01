import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: any;
  let prismaService: any;

  const validPayload = {
    sub: 'user-uuid-1',
    email: 'admin@portfolio.dev',
    role: 'admin',
    tokenVersion: 1,
    iss: 'portfolio-api',
    aud: 'portfolio-admin',
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const createMockContext = (authHeader?: string): ExecutionContext => {
    const request: any = {
      headers: authHeader ? { authorization: authHeader } : {},
    };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    jwtService = {
      verifyAsync: jest.fn(),
    };

    prismaService = {
      adminUser: {
        findUnique: jest.fn(),
      },
    };

    const configService = {
      getOrThrow: jest.fn().mockReturnValue('test-jwt-secret-minimum-32-chars-long!'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow request with valid JWT and active tokenVersion', async () => {
    const context = createMockContext('Bearer valid.jwt.token');
    jwtService.verifyAsync.mockResolvedValue({ ...validPayload });
    prismaService.adminUser.findUnique.mockResolvedValue({ tokenVersion: 1 });

    const allowed = await guard.canActivate(context);

    expect(allowed).toBe(true);
    const req = context.switchToHttp().getRequest<any>();
    expect(req.admin).toEqual(validPayload);
  });

  it('should reject request when Authorization header is missing', async () => {
    const context = createMockContext(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Authentication token missing'),
    );
  });

  it('should reject request when Authorization header does not start with Bearer', async () => {
    const context = createMockContext('Basic dXNlcjpwYXNz');

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Authentication token missing'),
    );
  });

  it('should reject request when JWT verification throws (expired or invalid signature)', async () => {
    const context = createMockContext('Bearer invalid.token');
    jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Token validation failed or expired'),
    );
  });

  it('should reject request when claims have non-admin role', async () => {
    const context = createMockContext('Bearer valid.token');
    jwtService.verifyAsync.mockResolvedValue({ ...validPayload, role: 'visitor' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Token claims failed structural or type validation'),
    );
  });

  it('should reject request when tokenVersion has been incremented (session revoked)', async () => {
    const context = createMockContext('Bearer valid.token');
    jwtService.verifyAsync.mockResolvedValue({ ...validPayload, tokenVersion: 1 });
    // User in database now has tokenVersion: 2 (revoked by logout or password change)
    prismaService.adminUser.findUnique.mockResolvedValue({ tokenVersion: 2 });

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Session has been revoked. Please log in again.'),
    );
  });

  it('should reject request if admin user is not found in database', async () => {
    const context = createMockContext('Bearer valid.token');
    jwtService.verifyAsync.mockResolvedValue({ ...validPayload });
    prismaService.adminUser.findUnique.mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Session has been revoked. Please log in again.'),
    );
  });
});

