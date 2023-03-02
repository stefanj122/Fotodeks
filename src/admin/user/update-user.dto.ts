import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { IsBoolean, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Password too week! Must contain minimum 6 characters, at least one UPPERCASE letter, one lowercase letter, one number and one special character!',
    },
  )
  password: string;

  @ApiProperty()
  @IsBoolean()
  isApproved: boolean;
}