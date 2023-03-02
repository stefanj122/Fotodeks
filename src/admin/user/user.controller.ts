import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';


@ApiTags('admin-user')
@Controller('/admin/user')
export class UserController {
  constructor(private readonly usersService: UserService) {}
}

