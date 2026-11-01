import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 60,
      },
      {
        name: 'login',
        ttl: 900000,
        limit: 5,
      },
      {
        name: 'ai',
        ttl: 60000,
        limit: 10,
      },
      {
        name: 'contact',
        ttl: 3600000,
        limit: 5,
      },
    ]),
  ],
})
export class AppModule {}
