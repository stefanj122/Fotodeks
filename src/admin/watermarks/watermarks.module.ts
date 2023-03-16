import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watermark } from 'src/entity/watermark.entity';
import { WatermarksController } from './watermarks.controller';
import { WatermarksService } from './watermarks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Watermark])],
  controllers: [WatermarksController],
  providers: [WatermarksService],
})
export class WatermarksModule {}
