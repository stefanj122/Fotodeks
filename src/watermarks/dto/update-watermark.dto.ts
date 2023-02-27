import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateWatermarkDto } from './create-watermark.dto';

export class UpdateWatermarkDto extends PartialType(CreateWatermarkDto) {
  @ApiProperty()
  description: string;
}
