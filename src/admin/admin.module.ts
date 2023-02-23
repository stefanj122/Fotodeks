import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/entity/image.entity';
import { User } from 'src/entity/user.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Image])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
