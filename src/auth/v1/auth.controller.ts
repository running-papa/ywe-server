import {
  Controller,
  Get,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from 'src/auth/dto/login.dto';

import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

//일반유저 로그인 가드
// import { NormalLocalAuthGuard } from '../guards/normal-local.guard';
// import { NormalJwtAuthGuard } from '../guards/normal-jwt.guard';
// import { NormalJwtRefreshAuthGuard } from '../guards/normal-jwt-refresh.guard';
// //커넥트 유저 로그인가드
// import { ConnectLocalAuthGuard } from '../guards/connect-local.guard';
// import { ConnectJwtAuthGuard } from '../guards/connect-jwt.guard';
// import { ConnectJwtRefreshAuthGuard } from '../guards/connect-jwt-refresh.guard';
//import { LocalAuthGuard } from '../guards/LocalAuthGuard.guard';

@ApiTags('유저 auth API')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({
    summary: '유저 로그인 API',
    description: '로그인 및 access token 발행한다.',
  })
  @ApiCreatedResponse({ description: '유저 로그인', type: LoginDto })
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    let isMatch: boolean;
    try {
      isMatch = await bcrypt.compare(req.body.password, req.user.password);
      //매칭 유저가 없을때
      if (!isMatch) {
        return {
          statusCode: 401,
          message: '비밀번호가 일지하지 않습니다.',
        };
      }

      if (req.user.uuid == null || req.user.uuid == '') {
        return {
          statusCode: 401,
          message: '1회원정보가 없습니다.',
        };
      } else {
        console.log('일반유저 로그인');
        const data = await this.authService.login(req.user);
        return data;
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 401,
        message: '2회원정보가 없습니다.',
      };
    }
  }

  @UseGuards(AuthGuard('connect'))
  @Post('/connect-login')
  @ApiOperation({
    summary: 'connect 유저 로그인 API',
    description: 'connect 로그인 및 access token 발행한다.',
  })
  @ApiCreatedResponse({ description: '유저 로그인', type: LoginDto })
  @ApiBody({ type: LoginDto })
  async connectLogin(@Request() req) {
    let isMatch: boolean;
    try {
      isMatch = await bcrypt.compare(req.body.password, req.user.password);
      //매칭 유저가 없을때
      if (!isMatch) {
        return {
          statusCode: 401,
          message: '비밀번호가 일지하지 않습니다.',
        };
      }

      if (req.user.uuid == null || req.user.uuid == '') {
        return {
          statusCode: 401,
          message: '회원정보가 없습니다.',
        };
      } else {
        console.log('커넥터유저 로그인');
        const data = await this.authService.connectLogin(req.user);
        return data;
      }
    } catch (error) {
      return {
        statusCode: 401,
        message: '회원정보가 없습니다.',
      };
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/logout')
  @ApiOperation({
    summary: '유저 로그아웃 API',
    description: '유저 로그아웃 및 리프레쉬 토큰 제거한다.',
  })
  async userLogout(@Request() req) {
    const logout = await this.authService.removeRefreshToken(
      req.user.email,
      req.user.provider,
    );

    if (logout != null) {
      return {
        statusCode: 201,
        message: '로그아웃 성공.',
      };
    } else {
      return {
        statusCode: 401,
        message: '로그아웃 실패.',
      };
    }
  }
  // Refresh Guard를 적용한다.
  @ApiBearerAuth()
  //@UseGuards(NormalJwtRefreshAuthGuard)
  @ApiOperation({
    summary: '유저 access_token 리프레쉬 API',
    description: '유저 access_token을 refresh_token 을 활용하여 재발행 한다.',
  })
  @Get('/refresh')
  async refreshToken(@Request() req) {
    if (req.user == null) throw new UnauthorizedException('Invalid token');

    return req.user; //await this.authService.matchRefreshToken(userId, provider, refreshToken);
  }
}
