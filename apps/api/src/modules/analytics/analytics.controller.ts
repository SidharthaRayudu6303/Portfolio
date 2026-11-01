import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { PageViewDto } from './dto/page-view.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('view')
  @HttpCode(HttpStatus.OK)
  async recordView(@Body() dto: PageViewDto, @Req() req: Request) {
    const rawIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      '127.0.0.1';
    const userAgent = req.headers['user-agent'];
    return this.analyticsService.recordPageView(dto, rawIp, userAgent);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  async getSummary() {
    return this.analyticsService.getSummary();
  }
}
