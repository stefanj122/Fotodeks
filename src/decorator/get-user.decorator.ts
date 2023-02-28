import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entity/user.entity';

export const GetUser = createParamDecorator(
  (data: User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
