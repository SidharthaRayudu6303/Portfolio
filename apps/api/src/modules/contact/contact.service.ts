import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: this.configService.get<number>('SMTP_PORT') || 587,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }
  }

  async submitMessage(dto: ContactDto) {
    // 1. Always persist to database first to guarantee zero message loss
    const saved = await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
      },
    });

    // 2. Dispatch email notification asynchronously (safe failure)
    if (this.transporter) {
      const recipient =
        this.configService.get<string>('CONTACT_RECIPIENT_EMAIL') ||
        this.configService.get<string>('ADMIN_EMAIL');

      if (recipient) {
        this.transporter
          .sendMail({
            from: `"Portfolio Contact" <${this.configService.get<string>('SMTP_USER')}>`,
            to: recipient,
            replyTo: dto.email,
            subject: `New Portfolio Contact Message from ${dto.name}`,
            text: `Name: ${dto.name}\nEmail: ${dto.email}\n\nMessage:\n${dto.message}`,
          })
          .catch((err) => {
            this.logger.warn(`SMTP notification failed (${err?.message || err}). Database record preserved.`);
          });
      }
    }

    return {
      success: true,
      id: saved.id,
      message: 'Your message has been received successfully. Thank you for reaching out!',
    };
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });
  }

  async remove(id: string) {
    return this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}
