import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(publishedOnly = true) {
    try {
      return await this.prisma.blogPost.findMany({
        where: publishedOnly ? { published: true } : undefined,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      });
    } catch {
      return [];
    }
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

  async create(data: CreateBlogPostDto) {
    return this.prisma.blogPost.create({
      data: {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      },
    });
  }

  async update(id: string, data: UpdateBlogPostDto) {
    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.blogPost.delete({
      where: { id },
    });
  }
}
