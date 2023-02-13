import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CreateUserDto } from 'src/users/dto/createUserDto.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SingUpMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const createUser: CreateUserDto = req.body;
    const email = this.usersService.findOneByEmail(createUser.email);
    const displayName = this.usersService.findOneByDisplayName(
      createUser.displayName,
    );
    if (email || displayName) {
      throw new BadRequestException('Email or display name alrady exists');
    }
    next();
  }
}
