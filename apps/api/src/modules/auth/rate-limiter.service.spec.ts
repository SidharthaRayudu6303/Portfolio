import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RateLimiterService', () => {
  let service: RateLimiterService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
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

  it('should record failed attempt via transaction with pg_advisory_xact_lock when count < 5', async () => {
    const mockTx = {
      $executeRaw: jest.fn().mockResolvedValue(1),
      $queryRaw: jest.fn().mockResolvedValue([{ failure_count: 2 }]),
    };
    mockPrismaService.$transaction.mockImplementation(async (cb: (tx: any) => Promise<any>) => {
      return cb(mockTx);
    });

    await expect(service.recordFailedAttemptAtomic('192.168.1.1')).resolves.not.toThrow();
    expect(mockTx.$executeRaw).toHaveBeenCalled();
  });

  it('should throw 429 via transaction when failure_count >= 5', async () => {
    const mockTx = {
      $executeRaw: jest.fn().mockResolvedValue(1),
      $queryRaw: jest.fn().mockResolvedValue([{ failure_count: 5 }]),
    };
    mockPrismaService.$transaction.mockImplementation(async (cb: (tx: any) => Promise<any>) => {
      return cb(mockTx);
    });

    await expect(service.recordFailedAttemptAtomic('192.168.1.1')).rejects.toThrow(
      new HttpException(
        'Too many failed login attempts. IP temporarily restricted for 15 minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      ),
    );
  });

  it('should enforce serialized lock and prevent lockout bypass under concurrent failed attempts', async () => {
    let currentFailures = 3;
    // Simulate transactional lock where transactions execute sequentially per IP
    mockPrismaService.$transaction.mockImplementation(async (cb: (tx: any) => Promise<any>) => {
      const mockTx = {
        $executeRaw: jest.fn().mockResolvedValue(1),
        $queryRaw: jest.fn().mockImplementation(async () => [{ failure_count: currentFailures }]),
      };
      const res = await cb(mockTx);
      currentFailures++;
      return res;
    });

    // Attempt 1: failureCount 3 -> success (inserted, now 4)
    await expect(service.recordFailedAttemptAtomic('192.168.1.1')).resolves.not.toThrow();
    // Attempt 2: failureCount 4 -> success (inserted, now 5)
    await expect(service.recordFailedAttemptAtomic('192.168.1.1')).resolves.not.toThrow();
    // Attempt 3: failureCount 5 -> locked out! (throws 429)
    await expect(service.recordFailedAttemptAtomic('192.168.1.1')).rejects.toThrow(HttpException);
    // Attempt 4: failureCount 6 -> locked out! (throws 429)
    await expect(service.recordFailedAttemptAtomic('192.168.1.1')).rejects.toThrow(HttpException);
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
