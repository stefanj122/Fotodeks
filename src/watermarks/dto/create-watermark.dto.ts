import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWatermarkDto {
  @ApiProperty()
  @IsString()
  description: string;
}
