import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserRoleGuard extends AuthGuard('jwt') implements CanActivate {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await (super.canActivate(context) as Promise<boolean>);
    const request = context.switchToHttp().getRequest();
    if (request?.user) {
      return (
        request.user.role === "user" ||
        request.user.role === "admin"
      );
  }
}
}
