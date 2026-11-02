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
    try {
      return await this.prisma.project.findMany({
        orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      });
    } catch {
      return [
        {
          id: 'proj-genvision',
          title: 'GenVision: A Cloud Severity-Aware Transformer-Diffusion Framework',
          slug: 'genvision',
          imageUrl: '/projects/genvision.svg',
          description:
            'An AI/ML-based satellite image reconstruction framework designed to recover cloud-obscured regions in satellite imagery and support agricultural analysis.',
          techStack: ['Next.js', 'React', 'Python', 'Transformers', 'Diffusion Models'],
          status: 'Final-year project — In Development',
          featured: true,
          order: 1,
        },
        {
          id: 'proj-bhuyanthra',
          title: 'BhuYanthra — AI-Powered Agricultural Intelligence Platform',
          slug: 'bhuyanthra',
          imageUrl: '/projects/bhuyanthra.svg',
          description:
            'An agricultural intelligence platform that uses satellite imagery and geospatial analysis to support agricultural monitoring and decision-making.',
          techStack: ['Next.js', 'React', 'Python', 'ISRO Bhuvan', 'Sentinel-2'],
          status: 'In Development',
          featured: true,
          order: 2,
        },
        {
          id: 'proj-robohatch',
          title: 'Robohatch — 3D Printed Products E-commerce Platform',
          slug: 'robohatch',
          imageUrl: '/projects/robohatch.svg',
          description:
            'An e-commerce platform designed for showcasing and selling 3D-printed products through an intuitive online shopping experience.',
          techStack: ['Next.js', 'NestJS', 'TypeScript', 'REST APIs', 'AWS', 'Vercel'],
          status: 'Developed / Deployed',
          featured: true,
          order: 3,
        },
        {
          id: 'proj-smartdonum',
          title: 'SmartDonum — Donation Management Platform',
          slug: 'smartdonum',
          imageUrl: '/projects/smartdonum.svg',
          description:
            'A donation management platform connecting donors and beneficiaries to make donations of food, clothing, and books more accessible and organized.',
          techStack: ['React.js', 'Next.js', 'REST APIs', 'MySQL'],
          status: 'Developed / Deployed',
          featured: true,
          order: 4,
        },
        {
          id: 'proj-autism',
          title: 'Autism Screening Platform',
          slug: 'autism-screening-platform',
          imageUrl: '/projects/autism-screening.svg',
          description:
            'A web-based autism screening platform designed to provide an accessible interface for screening-related assessments and media submissions.',
          techStack: ['React', 'Vite', 'TypeScript'],
          status: 'Developed / Deployed',
          featured: false,
          order: 5,
        },
        {
          id: 'proj-rental',
          title: 'Smart Rental Platform — Equipment & Fleet Management Dashboard',
          slug: 'smart-rental-platform',
          imageUrl: '/projects/smart-rental.svg',
          description:
            'An equipment and fleet management platform designed to help monitor rental equipment, track operations, and visualize key business information.',
          techStack: ['React.js', 'Next.js', 'REST APIs', 'Vercel'],
          status: 'Developed / Deployed',
          featured: false,
          order: 6,
        },
      ];
    }
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
