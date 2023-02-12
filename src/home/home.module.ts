import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Images } from 'src/entity/image.entity';
import { Users } from 'src/entity/user.entity';
import { ImagesService } from 'src/images/images.service';
import { UsersService } from 'src/users/users.service';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [TypeOrmModule.forFeature([Images, Users])],
  controllers: [HomeController],
  providers: [
    HomeService,
    AuthService,
    UsersService,
    JwtService,
    ImagesService,
  ],
})
export class HomeModule {}
