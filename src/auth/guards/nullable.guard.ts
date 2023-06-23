import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext) {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();

        console.log('OptionalAuthGuard', request.headers.authorization)
        // JWT 토큰이 없어도 통과하도록 설정
        if (!request.headers.authorization) {
            return true;
        }

        console.log(request);
        return request.user;
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            return false; // 인증 실패시 false 리턴
        }
        console.log('handle ',user)
        return user;
    }
 }