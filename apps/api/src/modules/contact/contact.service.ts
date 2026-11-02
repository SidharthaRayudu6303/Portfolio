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
    this.initTransporter();
  }

  private initTransporter(): void {
    const smtpHost = this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    const smtpPort = Number(this.configService.get<number>('SMTP_PORT')) || 465;
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const isGmail = smtpHost.includes('gmail.com');
    const smtpSecure =
      this.configService.get<string>('SMTP_SECURE') === 'true' || smtpPort === 465;

    if (smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          ...(isGmail
            ? {
                service: 'gmail',
              }
            : {}),
        });
        this.logger.log(`SMTP transporter ready: ${smtpUser} via ${smtpHost}:${smtpPort}`);
      } catch (err: any) {
        this.logger.error(`Failed to create SMTP transporter: ${err?.message || err}`);
      }
    } else {
      this.logger.warn(
        'SMTP transporter not initialized: SMTP_USER or SMTP_PASS is missing in apps/api/.env',
      );
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private buildEmailHtml(dto: ContactDto, recipient: string): string {
    const safeName = this.escapeHtml(dto.name);
    const safeEmail = this.escapeHtml(dto.email);
    const safeMessage = this.escapeHtml(dto.message);
    const timestamp = new Date().toUTCString();

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e5e5;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #12131a; border: 1px solid #1f293d; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #091e2b 0%, #0d2938 100%); padding: 32px 36px; border-bottom: 1px solid #164e63;">
      <div style="display: inline-block; padding: 4px 12px; background-color: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 9999px; font-size: 11px; font-family: monospace; color: #22d3ee; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;">
        Portfolio Transmission
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
        New Message Received
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">
        Transmitted via <a href="https://sidhartha-portfolio.vercel.app" style="color: #38bdf8; text-decoration: none;">sidhartha.dev</a>
      </p>
    </div>

    <!-- Body Content -->
    <div style="padding: 36px;">
      <!-- Sender Metadata Cards -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 12px 16px; background-color: #181924; border-radius: 10px 10px 0 0; border: 1px solid #232536; border-bottom: none;">
            <span style="display: block; font-size: 11px; font-family: monospace; color: #64748b; text-transform: uppercase;">From Name</span>
            <span style="font-size: 15px; font-weight: 600; color: #ffffff;">${safeName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; background-color: #181924; border: 1px solid #232536;">
            <span style="display: block; font-size: 11px; font-family: monospace; color: #64748b; text-transform: uppercase;">Sender Email</span>
            <a href="mailto:${safeEmail}" style="font-size: 15px; font-weight: 600; color: #22d3ee; text-decoration: none;">${safeEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; background-color: #181924; border-radius: 0 0 10px 10px; border: 1px solid #232536; border-top: none;">
            <span style="display: block; font-size: 11px; font-family: monospace; color: #64748b; text-transform: uppercase;">Received At</span>
            <span style="font-size: 13px; color: #94a3b8;">${timestamp}</span>
          </td>
        </tr>
      </table>

      <!-- Message Container -->
      <div style="margin-bottom: 28px;">
        <span style="display: block; font-size: 11px; font-family: monospace; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Message Content</span>
        <div style="background-color: #0b0c12; border: 1px solid #1e2230; border-left: 3px solid #06b6d4; border-radius: 8px; padding: 20px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${safeMessage}</div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="mailto:${safeEmail}?subject=Re:%20Portfolio%20Inquiry%20from%20Sidhartha%20Rayudu" style="display: inline-block; background-color: #06b6d4; color: #050b14; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3);">
          Reply to ${safeName} &rarr;
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 20px 36px; background-color: #0b0c12; border-top: 1px solid #1a1d28; text-align: center; font-size: 11px; color: #64748b;">
      Sent directly to <span style="color: #94a3b8;">${recipient}</span> from your personal portfolio website.
    </div>

  </div>
</body>
</html>`;
  }

  async submitMessage(dto: ContactDto) {
    const savedId: string = 'msg_' + Date.now();

    // Re-check transporter if not already initialized (allows runtime .env hot reloading)
    if (!this.transporter) {
      this.initTransporter();
    }

    // 1. Dispatch email notification to Sidhartha
    const recipient =
      this.configService.get<string>('CONTACT_RECIPIENT_EMAIL') ||
      this.configService.get<string>('ADMIN_EMAIL') ||
      'madhavarapusidhartharayudu@gmail.com';

    let emailSent = false;
    if (this.transporter) {
      try {
        const smtpUser = this.configService.get<string>('SMTP_USER') || recipient;
        await this.transporter.sendMail({
          from: `"Portfolio Contact" <${smtpUser}>`,
          to: recipient,
          replyTo: `"${dto.name}" <${dto.email}>`,
          subject: `✨ New Portfolio Contact Message from ${dto.name}`,
          text: `You received a new message from your portfolio contact form:\n\nName: ${dto.name}\nEmail: ${dto.email}\nDate: ${new Date().toLocaleString()}\n\nMessage:\n${dto.message}\n\n---\nDirect reply will go to: ${dto.email}`,
          html: this.buildEmailHtml(dto, recipient),
        });
        emailSent = true;
        this.logger.log(`Contact message successfully delivered to ${recipient}`);
      } catch (err: any) {
        this.logger.error(`SMTP notification failed: ${err?.message || err}`);
      }
    } else {
      this.logger.warn(
        `[CONTACT SUBMISSION LOG] Name: "${dto.name}" | Email: "${dto.email}" | Message: "${dto.message}" (SMTP not configured in apps/api/.env)`,
      );
    }

    // 2. Concurrently attempt database persistence (non-blocking for fast UI response)
    this.prisma.contactMessage
      .create({
        data: {
          name: dto.name,
          email: dto.email,
          message: dto.message,
        },
      })
      .then((saved) => {
        this.logger.log(`Contact message saved to database (ID: ${saved.id})`);
      })
      .catch((dbErr: any) => {
        this.logger.warn(`Database persistence deferred: ${dbErr?.message || dbErr}`);
      });

    return {
      success: true,
      id: savedId,
      emailSent,
      message: 'Your message has been received successfully. Thank you for reaching out!',
    };
  }

  async findAll() {
    try {
      return await this.prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [];
    }
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
