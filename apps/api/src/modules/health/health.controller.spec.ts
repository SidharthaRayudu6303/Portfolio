import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaService } from '../../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prismaService: PrismaService;

  const mockPrismaService = {
    isHealthy: jest.fn(),
  };

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return 200 and ok status when database is healthy', async () => {
    mockPrismaService.isHealthy.mockResolvedValue(true);
    const res = mockResponse();

    await controller.checkHealth(res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ok',
        database: 'connected',
      }),
    );
  });

  it('should return 503 and degraded status when database is disconnected', async () => {
    mockPrismaService.isHealthy.mockResolvedValue(false);
    const res = mockResponse();

    await controller.checkHealth(res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'degraded',
        database: 'disconnected',
      }),
    );
  });
});
