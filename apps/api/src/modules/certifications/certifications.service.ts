import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';

@Injectable()
export class CertificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.certification.findMany({
        orderBy: [{ order: 'asc' }, { issueDate: 'desc' }],
      });
    } catch {
      return [];
    }
  }

  async findOneById(id: string) {
    const cert = await this.prisma.certification.findUnique({
      where: { id },
    });
    if (!cert) {
      throw new NotFoundException(`Certification with ID "${id}" not found`);
    }
    return cert;
  }

  async create(data: CreateCertificationDto) {
    return this.prisma.certification.create({
      data: {
        title: data.title,
        issuer: data.issuer,
        issueDate: new Date(data.issueDate),
        credentialUrl: data.credentialUrl || null,
        imageUrl: data.imageUrl || null,
        order: data.order ?? 0,
      },
    });
  }

  async update(id: string, data: UpdateCertificationDto) {
    await this.findOneById(id);

    const updateData: any = { ...data };
    if (data.issueDate) {
      updateData.issueDate = new Date(data.issueDate);
    }

    return this.prisma.certification.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOneById(id);
    return this.prisma.certification.delete({
      where: { id },
    });
  }
}
