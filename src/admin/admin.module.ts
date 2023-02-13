import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/entity/image.entity';
import { Users } from 'src/entity/user.entity';
import { Watermark } from 'src/entity/watermark.entity';
import { ImagesService } from 'src/images/images.service';
import { UsersService } from 'src/users/users.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Images, Watermark]),
    MulterModule.register({
      dest: process.cwd() + '/photos/watermark',
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, ImagesService, UsersService],
})
export class AdminModule {}
