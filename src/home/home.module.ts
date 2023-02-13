import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Images } from 'src/entity/image.entity';
import { Users } from 'src/entity/user.entity';
import { Watermark } from 'src/entity/watermark.entity';
import { ImagesService } from 'src/images/images.service';
import { SingUpMiddleware } from 'src/middleware/singup.middleware';
import { UsersService } from 'src/users/users.service';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [TypeOrmModule.forFeature([Images, Users, Watermark])],
  controllers: [HomeController],
  providers: [
    HomeService,
    AuthService,
    UsersService,
    JwtService,
    ImagesService,
  ],
})
export class HomeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SingUpMiddleware).forRoutes('/home/singup');
  }
}
