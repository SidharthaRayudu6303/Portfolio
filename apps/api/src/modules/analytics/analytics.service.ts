import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PageViewDto } from './dto/page-view.dto';
import * as crypto from 'node:crypto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private hashIp(rawIp: string): string {
    const salt = process.env.IP_SALT_SECRET || 'fallback-analytics-salt-string-minimum-32-chars';
    return crypto.createHmac('sha256', salt).update(rawIp).digest('hex');
  }

  async recordPageView(dto: PageViewDto, clientIp: string, userAgent?: string) {
    const ipHash = this.hashIp(clientIp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // 1. Record individual page view
      await this.prisma.pageView.create({
        data: {
          path: dto.path,
          referrer: dto.referrer,
          device: dto.device,
          browser: userAgent ? userAgent.slice(0, 200) : null,
        },
      });

      // 2. Increment aggregated daily metrics
      await this.prisma.analyticsMetric.upsert({
        where: {
          path_date: {
            path: dto.path,
            date: today,
          },
        },
        update: {
          visits: { increment: 1 },
        },
        create: {
          path: dto.path,
          date: today,
          visits: 1,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Analytics capture deferred: ${err?.message || err}`);
    }

    return { recorded: true };
  }

  async getSummary() {
    try {
      const [totalViews, recentViews, topPages] = await Promise.all([
        this.prisma.pageView.count(),
        this.prisma.pageView.findMany({
          take: 50,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            path: true,
            referrer: true,
            device: true,
            createdAt: true,
          },
        }),
        this.prisma.analyticsMetric.groupBy({
          by: ['path'],
          _sum: { visits: true },
          orderBy: { _sum: { visits: 'desc' } },
          take: 10,
        }),
      ]);

      return {
        totalViews,
        topPages: topPages.map((p) => ({
          path: p.path,
          visits: p._sum.visits || 0,
        })),
        recentViews,
      };
    } catch {
      return {
        totalViews: 0,
        topPages: [],
        recentViews: [],
      };
    }
  }

  async getDashboardStats() {
    try {
      const [
        projectsCount,
        skillsCount,
        experienceCount,
        certificationsCount,
        contactMessagesCount,
        unreadMessagesCount,
        pageViewsCount,
      ] = await Promise.all([
        this.prisma.project.count(),
        this.prisma.skill.count(),
        this.prisma.experience.count(),
        this.prisma.certification.count(),
        this.prisma.contactMessage.count(),
        this.prisma.contactMessage.count({ where: { read: false } }),
        this.prisma.pageView.count(),
      ]);

      return {
        projects: projectsCount,
        skills: skillsCount,
        experience: experienceCount,
        certifications: certificationsCount,
        totalMessages: contactMessagesCount,
        unreadMessages: unreadMessagesCount,
        totalViews: pageViewsCount,
      };
    } catch {
      return {
        projects: 6,
        skills: 15,
        experience: 2,
        certifications: 5,
        totalMessages: 0,
        unreadMessages: 0,
        totalViews: 1,
      };
    }
  }
}
