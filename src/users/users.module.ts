import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/entity/image.entity';
import { Users } from 'src/entity/user.entity';
import { Watermark } from 'src/entity/watermark.entity';
import { ImagesService } from 'src/images/images.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Images, Watermark])],
  controllers: [UsersController],
  providers: [UsersService, ImagesService],
})
export class UsersModule {}
