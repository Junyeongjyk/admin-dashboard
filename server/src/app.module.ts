import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { GlobalModule } from './global/global.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';

@Module({
  imports: [
    RedisModule,
    GlobalModule,
    AuthModule,
    TypeOrmModule.forRoot(databaseConfig.options)
  ],
  controllers: [],
  providers: [
    AuthenticationMiddleware
  ],
})
export class AppModule implements NestModule {

  constructor(
    private readonly authenticationMiddleware: AuthenticationMiddleware
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.authenticationMiddleware.use.bind(this.authenticationMiddleware)).forRoutes('*')
  } 
}