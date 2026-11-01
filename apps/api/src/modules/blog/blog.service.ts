import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(publishedOnly = true) {
    return this.prisma.blogPost.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOneBySlug(slug: string, publishedOnly = true) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post || (publishedOnly && !post.published)) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    return post;
  }

  async create(data: any) {
    return this.prisma.blogPost.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.blogPost.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.blogPost.delete({
      where: { id },
    });
  }
}
