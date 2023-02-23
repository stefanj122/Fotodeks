import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Users } from "../entity/user.entity";

export const GetUser = createParamDecorator(
    (data: Users, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user
});
    