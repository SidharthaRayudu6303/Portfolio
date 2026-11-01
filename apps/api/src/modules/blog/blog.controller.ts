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
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAllPublished() {
    return this.blogService.findAll(true);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  async findAllAdmin() {
    return this.blogService.findAll(false);
  }

  @Get(':slug')
  async findOneBySlug(@Param('slug') slug: string) {
    return this.blogService.findOneBySlug(slug, true);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: any) {
    return this.blogService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() body: any) {
    return this.blogService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.blogService.remove(id);
  }
}
