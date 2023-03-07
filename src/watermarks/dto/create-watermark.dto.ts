import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateWatermarkDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
}
