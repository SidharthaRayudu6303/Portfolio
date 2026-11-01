import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

let cachedServer: any;

async function bootstrapServer() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'https://sidhartha-portfolio.vercel.app';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  cachedServer(req, res);
}
