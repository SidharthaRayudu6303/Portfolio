import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RateLimiterService } from './rate-limiter.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, RateLimiterService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule, RateLimiterService],
})
export class AuthModule {}
