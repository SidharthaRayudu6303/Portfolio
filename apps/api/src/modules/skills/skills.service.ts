import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
  }

  async create(data: any) {
    return this.prisma.skill.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.skill.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.skill.delete({
      where: { id },
    });
  }
}
