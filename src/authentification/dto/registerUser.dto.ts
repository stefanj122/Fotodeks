import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
import { IsBoolean, IsEmail } from "class-validator"

export class UserDto 
{
    @ApiProperty()
    @IsString()
    firstName: string

    @ApiProperty()
    @IsString()
    lastName: string

    @ApiProperty()
    @IsString()
    displayName: string

    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    password: string

    @ApiProperty()
    @IsBoolean()
    isApproved: boolean

    @ApiProperty({default: 'user'})
    @IsString()
    role: string
}   