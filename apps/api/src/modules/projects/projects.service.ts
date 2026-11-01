import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOneBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
    });
    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }
    return project;
  }

  async findOneById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return project;
  }

  async create(data: CreateProjectDto) {
    // Prevent duplicate slugs
    const existing = await this.prisma.project.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      throw new ConflictException(`A project with slug "${data.slug}" already exists`);
    }

    return this.prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        techStack: data.techStack,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        imageUrl: data.imageUrl || null,
        featured: data.featured ?? false,
        order: data.order ?? 0,
      },
    });
  }

  async update(id: string, data: UpdateProjectDto) {
    await this.findOneById(id);

    // If slug is being updated, verify uniqueness
    if (data.slug) {
      const existing = await this.prisma.project.findUnique({
        where: { slug: data.slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`A project with slug "${data.slug}" already exists`);
      }
    }

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOneById(id);
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
