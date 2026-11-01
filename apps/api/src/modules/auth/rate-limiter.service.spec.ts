import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RateLimiterService', () => {
  let service: RateLimiterService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    $queryRaw: jest.fn(),
    loginAttempt: {
      count: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    process.env.IP_SALT_SECRET = 'test-salt-secret-key-minimum-32-chars!';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimiterService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RateLimiterService>(RateLimiterService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should hash IP addresses deterministically using HMAC-SHA256', () => {
    const hash1 = service.hashIp('192.168.1.1');
    const hash2 = service.hashIp('192.168.1.1');
    const hashDiff = service.hashIp('10.0.0.1');

    expect(hash1).toEqual(hash2);
    expect(hash1).not.toEqual(hashDiff);
    expect(hash1).toHaveLength(64); // SHA256 hex length
  });

  it('should record failed attempt when failure limit is not exceeded', async () => {
    mockPrismaService.$queryRaw.mockResolvedValue([{ id: 'mock-attempt-id' }]);

    await expect(service.recordFailedAttemptAtomic('192.168.1.1')).resolves.not.toThrow();
  });

  it('should throw 429 Too Many Requests when CTE returns 0 rows (lockout)', async () => {
    mockPrismaService.$queryRaw.mockResolvedValue([]);

    await expect(service.recordFailedAttemptAtomic('192.168.1.1')).rejects.toThrow(
      new HttpException(
        'Too many failed login attempts. IP temporarily restricted for 15 minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      ),
    );
  });

  it('should throw 429 on assertNotLockedOut when count >= 5', async () => {
    mockPrismaService.loginAttempt.count.mockResolvedValue(5);

    await expect(service.assertNotLockedOut('192.168.1.1')).rejects.toThrow(
      new HttpException(
        'Too many failed login attempts. IP temporarily restricted for 15 minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      ),
    );
  });

  it('should allow assertNotLockedOut when count < 5', async () => {
    mockPrismaService.loginAttempt.count.mockResolvedValue(4);

    await expect(service.assertNotLockedOut('192.168.1.1')).resolves.not.toThrow();
  });
});
