import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.experience.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
    });
  }

  async findOneById(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });
    if (!experience) {
      throw new NotFoundException(`Experience with ID "${id}" not found`);
    }
    return experience;
  }

  async create(data: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        company: data.company,
        role: data.role,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        current: data.current ?? false,
        order: data.order ?? 0,
      },
    });
  }

  async update(id: string, data: UpdateExperienceDto) {
    await this.findOneById(id);

    const updateData: any = { ...data };
    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    }

    return this.prisma.experience.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOneById(id);
    return this.prisma.experience.delete({
      where: { id },
    });
  }
}
