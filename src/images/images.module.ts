import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/entity/image.entity';
import { Users } from 'src/entity/user.entity';
import { Watermark } from 'src/entity/watermark.entity';
import { UsersService } from 'src/users/users.service';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Images, Users, Watermark]),
    MulterModule.register({
      dest: process.cwd() + '/photos',
    }),
  ],
  controllers: [ImagesController],
  providers: [ImagesService, UsersService],
})
export class ImagesModule {}
