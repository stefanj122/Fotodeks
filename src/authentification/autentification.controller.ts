import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './autentification.service';
import { UserDto } from './dto/registerUser.dto';



@ApiTags("auth")
@Controller('authController')
export class AuthController {
    constructor(
                private readonly AuthService: AuthService
                ) { }

@Post()
newUser(@Body() body: UserDto) {
  return this.AuthService.registerNewUser(body);
}
 
// @Get('/:id')
// getOne(@Param('id') id: number) {
//   return this.UserService.getOneUser(+id);
// }
    
    
}