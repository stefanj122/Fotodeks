import { Controller, ForbiddenException, Get} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { UserService } from './user.service';

@ApiTags('admin-user')
@Controller('/admin/user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('/me')
  async getCurrentUser(@GetUser() user){
    console.log(user);
    if (user){
      delete user.password;
      return user;
    }
    throw new ForbiddenException()
  }
}
