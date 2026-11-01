import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async checkHealth(@Res() res: Response) {
    const isDbHealthy = await this.prisma.isHealthy();
    const status = isDbHealthy ? 'ok' : 'degraded';
    const httpStatus = isDbHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;

    return res.status(httpStatus).json({
      status,
      timestamp: new Date().toISOString(),
      database: isDbHealthy ? 'connected' : 'disconnected',
      uptime: process.uptime(),
    });
  }
}
