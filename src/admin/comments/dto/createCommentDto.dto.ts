import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNumber()
  imageId: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rate: number;

  @ApiProperty()
  @IsString()
  content: string;
}
