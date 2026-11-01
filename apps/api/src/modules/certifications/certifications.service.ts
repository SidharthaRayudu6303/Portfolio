import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CertificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.certification.findMany({
      orderBy: [{ order: 'asc' }, { issueDate: 'desc' }],
    });
  }

  async create(data: any) {
    return this.prisma.certification.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.certification.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.certification.delete({
      where: { id },
    });
  }
}
