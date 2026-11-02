import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.skill.findMany({
        orderBy: [{ category: 'asc' }, { order: 'asc' }, { level: 'desc' }],
      });
    } catch {
      return [];
    }
  }

  async findOneById(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });
    if (!skill) {
      throw new NotFoundException(`Skill with ID "${id}" not found`);
    }
    return skill;
  }

  async create(data: CreateSkillDto) {
    const existing = await this.prisma.skill.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      throw new ConflictException(`A skill with name "${data.name}" already exists`);
    }

    return this.prisma.skill.create({
      data: {
        name: data.name,
        category: data.category,
        level: data.level,
        order: data.order ?? 0,
      },
    });
  }

  async update(id: string, data: UpdateSkillDto) {
    await this.findOneById(id);

    if (data.name) {
      const existing = await this.prisma.skill.findUnique({
        where: { name: data.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`A skill with name "${data.name}" already exists`);
      }
    }

    return this.prisma.skill.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOneById(id);
    return this.prisma.skill.delete({
      where: { id },
    });
  }
}
