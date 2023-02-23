import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('userControler')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
