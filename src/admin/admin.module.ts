import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/entity/image.entity';
import { Users } from 'src/entity/user.entity';
import { ImagesService } from 'src/images/images.service';
import { UsersService } from 'src/users/users.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Images])],
  controllers: [AdminController],
  providers: [AdminService, ImagesService, UsersService],
})
export class AdminModule {}
