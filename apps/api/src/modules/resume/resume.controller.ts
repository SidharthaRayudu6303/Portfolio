import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResumeService } from './resume.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  // Public: Get metadata of active resume
  @Get('active')
  async getActiveMeta() {
    const meta = await this.resumeService.getActiveResumeMeta();
    return meta ? { available: true, resume: meta } : { available: false, message: 'No active resume uploaded yet.' };
  }

  // Public: Stream/download active PDF resume
  @Get('download')
  async downloadActive(@Res() res: Response) {
    const resume = await this.resumeService.getActiveResumeData();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${resume.filename}"`,
      'Content-Length': resume.fileSize.toString(),
      'Cache-Control': 'public, max-age=1800',
    });

    res.send(Buffer.from(resume.fileData));
  }

  // Admin: Download any version by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async downloadVersion(@Param('id') id: string, @Res() res: Response) {
    const resume = await this.resumeService.getResumeById(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${resume.filename}"`,
      'Content-Length': resume.fileSize.toString(),
    });

    res.send(Buffer.from(resume.fileData));
  }

  // Admin: List all versions
  @UseGuards(JwtAuthGuard)
  @Get('admin/list')
  async listAll() {
    return this.resumeService.listAll();
  }

  // Admin: Upload new PDF resume (Accepts JSON with base64 data)
  @UseGuards(JwtAuthGuard)
  @Post('admin/upload')
  async upload(@Body() body: { filename: string; label?: string; fileBase64: string }) {
    if (!body.filename || !body.fileBase64) {
      throw new BadRequestException('filename and fileBase64 fields are required.');
    }

    const cleanBase64 = body.fileBase64.replace(/^data:application\/pdf;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    return this.resumeService.uploadResume(body.filename, body.label || 'Resume', buffer);
  }

  // Admin: Set a version as active
  @UseGuards(JwtAuthGuard)
  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    return this.resumeService.activateVersion(id);
  }

  // Admin: Update metadata
  @UseGuards(JwtAuthGuard)
  @Patch(':id/meta')
  async updateMeta(
    @Param('id') id: string,
    @Body() body: { label?: string; filename?: string },
  ) {
    return this.resumeService.updateMeta(id, body.label, body.filename);
  }

  // Admin: Delete an inactive version
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteVersion(@Param('id') id: string) {
    return this.resumeService.deleteVersion(id);
  }
}

