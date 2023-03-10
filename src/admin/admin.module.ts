import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/entity/image.entity';
import { User } from 'src/entity/user.entity';
import { Watermark } from 'src/entity/watermark.entity';
import { ImagesService } from 'src/images/images.service';
import { WatermarksModule } from 'src/admin/watermarks/watermarks.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CommentsModule } from './comments/comments.module';
import { ImagesModule } from './images/images.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Image, Watermark]),
    ImagesModule,
    CommentsModule,
    UserModule,
    WatermarksModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, ImagesService],
})
export class AdminModule {}
