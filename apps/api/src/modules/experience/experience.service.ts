import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.experience.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
    });
  }

  async create(data: any) {
    return this.prisma.experience.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.experience.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.experience.delete({
      where: { id },
    });
  }
}
