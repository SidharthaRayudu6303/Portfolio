import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResumeService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveResumeMeta() {
    const active = await this.prisma.resumeDocument.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        label: true,
        mimeType: true,
        fileSize: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return active || null;
  }

  async getActiveResumeData() {
    const active = await this.prisma.resumeDocument.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    if (!active) {
      throw new NotFoundException('No active resume uploaded yet.');
    }
    return active;
  }

  async getResumeById(id: string) {
    const resume = await this.prisma.resumeDocument.findUnique({
      where: { id },
    });
    if (!resume) {
      throw new NotFoundException(`Resume with ID ${id} not found.`);
    }
    return resume;
  }

  async listAll() {
    return this.prisma.resumeDocument.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        label: true,
        mimeType: true,
        fileSize: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async uploadResume(filename: string, label: string, buffer: Buffer) {
    // 1. Max size: 5 MB
    const maxSize = 5 * 1024 * 1024;
    if (buffer.length > maxSize) {
      throw new BadRequestException('Resume file exceeds maximum allowed size of 5 MB.');
    }

    // 2. Validate PDF magic bytes: 0x25 0x50 0x44 0x46 (%PDF-)
    if (
      buffer.length < 4 ||
      buffer[0] !== 0x25 ||
      buffer[1] !== 0x50 ||
      buffer[2] !== 0x44 ||
      buffer[3] !== 0x46
    ) {
      throw new BadRequestException('Invalid file signature. Only authentic PDF documents (%PDF-) are accepted.');
    }

    // Sanitize filename
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_') || 'Sidhartha_Rayudu_Resume.pdf';

    // 3. Atomically set existing to inactive and create new active resume
    return this.prisma.$transaction(async (tx) => {
      await tx.resumeDocument.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      return tx.resumeDocument.create({
        data: {
          filename: cleanFilename,
          label: label || 'Sidhartha Rayudu Resume',
          mimeType: 'application/pdf',
          fileSize: buffer.length,
          fileData: new Uint8Array(buffer),
          isActive: true,
        },
        select: {
          id: true,
          filename: true,
          label: true,
          mimeType: true,
          fileSize: true,
          isActive: true,
          createdAt: true,
        },
      });
    });
  }

  async activateVersion(id: string) {
    await this.getResumeById(id);

    return this.prisma.$transaction(async (tx) => {
      await tx.resumeDocument.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      return tx.resumeDocument.update({
        where: { id },
        data: { isActive: true },
        select: {
          id: true,
          filename: true,
          label: true,
          fileSize: true,
          isActive: true,
          createdAt: true,
        },
      });
    });
  }

  async updateMeta(id: string, label?: string, filename?: string) {
    await this.getResumeById(id);
    const data: any = {};
    if (label) data.label = label;
    if (filename) data.filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    return this.prisma.resumeDocument.update({
      where: { id },
      data,
      select: {
        id: true,
        filename: true,
        label: true,
        fileSize: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async deleteVersion(id: string) {
    const resume = await this.getResumeById(id);
    if (resume.isActive) {
      throw new BadRequestException('Cannot delete the currently active resume. Activate another version first.');
    }

    return this.prisma.resumeDocument.delete({
      where: { id },
      select: { id: true, filename: true },
    });
  }
}
