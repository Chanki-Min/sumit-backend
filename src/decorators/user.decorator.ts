import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class AuthzUser {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  azp: string;
  gty: string;
}

export const User = createParamDecorator<any, ExecutionContext, AuthzUser>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthzUser;
  },
);
