import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async submit(@Body() contactDto: ContactDto) {
    return this.contactService.submitMessage(contactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.contactService.findAll();
  }

  @Put(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.contactService.remove(id);
  }
}
