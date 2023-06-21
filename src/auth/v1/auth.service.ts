import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersModel } from 'src/users/models/users.model';
import { UsersLoginModel } from 'src/users/models/users_login.model';
import { UsersService } from 'src/users/v1/users.service';
import * as bcrypt from 'bcrypt';
import { ConnectUsersService } from 'src/connect/v1/connect.service';
import internal from 'stream';
import { JwtConstants, JwtRefreshConstants } from '../constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => ConnectUsersService))
    private readonly connectUsersService: ConnectUsersService,
  ) {}

  async matchUser(email: string): Promise<any> {
    return await this.usersService.matchUser(email);
  }

  async matchConnectUser(email: string): Promise<any> {
    return await this.connectUsersService.matchUser(email);
  }

  async login(user: any) {
    const payload = {
      uuid: user.uuid,
      email: user.email,
      provider: user.provider,
      nickName: user.nickName,
      phone: user.phone,
      fox: user.fox,
    };

    const access_data = {
      statusCode: 201,
      message: '로그인 성공. 일반유저',
      user: {
        uuid: user.uuid,
        email: user.email,
        provider: user.provider ? user.provider : 'guest',
        nickName: user.nickName ? user.nickName : '이름없음',
        phone: user.phone ? user.phone : '',
        fox: user.fox ? user.fox : 0,
      },
      access_token: this.jwtService.sign(
        payload,
        this.getTokenJwtOptions('normal'),
      ),
      refresh_token: this.jwtService.sign(
        payload,
        this.getTokenOptions('normal'),
      ),
    };

    //로그인 할시 리프레쉬 토큰 새롭게 저장
    await this.setCurrentRefreshToken(
      user.user_level,
      access_data.user.email,
      access_data.user.provider,
      access_data.refresh_token,
    );
    //로그인 할시 유저 로그인 at 에 현재 로그인 한 시간 새롭게 저장
    await this.setLoginAt(user.user_level, access_data.user.email);

    return access_data;
  }

  async connectLogin(user: any) {
    const payload = {
      uuid: user.uuid,
      email: user.email,
      provider: user.provider,
      nickName: user.nickName,
      phone: user.phone,
      fox: user.fox,
    };

    const access_data = {
      statusCode: 201,
      message: '로그인 성공. 커넥터유저',
      user: {
        uuid: user.uuid,
        email: user.email,
        provider: user.provider ? user.provider : 'guest',
        nickName: user.nickName ? user.nickName : '이름없음',
        phone: user.phone ? user.phone : '',
        fox: user.fox ? user.fox : 0,
      },
      access_token: this.jwtService.sign(
        payload,
        this.getTokenJwtOptions('connect'),
      ),
      refresh_token: this.jwtService.sign(
        payload,
        this.getTokenOptions('connect'),
      ),
    };

    //로그인 할시 리프레쉬 토큰 새롭게 저장
    await this.setCurrentRefreshToken(
      user.user_level,
      access_data.user.email,
      access_data.user.provider,
      access_data.refresh_token,
    );
    //로그인 할시 유저 로그인 at 에 현재 로그인 한 시간 새롭게 저장
    await this.setLoginAt(user.user_level, access_data.user.email);

    return access_data;
  }

  private getTokenJwtOptions(type) {
    let options: JwtSignOptions = null;
    const expiration = '1d';
    options = {
      privateKey: JwtConstants.secret,
      expiresIn: expiration,
    };

    return options;
  }

  private getTokenOptions(type) {
    let options: JwtSignOptions = null;
    const expiration = '1y';
    options = {
      privateKey: JwtRefreshConstants.secret,
      expiresIn: expiration,
    };

    return options;
  }

  async matchRefreshToken(
    userId: string,
    provider: string,
    refresh_token: string,
    user: any,
  ) {
    const isRefreshTokenMatching = await this.usersService.matchRefreshToken(
      userId,
      provider,
      refresh_token,
    );

    if (isRefreshTokenMatching == false) {
      throw new UnauthorizedException('Invalid token');
    } else {
      const payload = {
        uuid: user.uuid,
        email: user.email,
        provider: user.provider,
        nickName: user.nickName,
        phone: user.phone,
        fox: user.fox,
      };

      const access_data = {
        statusCode: 201,
        message: '리프레쉬 토큰 새로고침 성공.',
        user: {
          uuid: user.uuid,
          email: user.email,
          provider: user.provider ? user.provider : 'guest',
          nickName: user.nickName ? user.nickName : '이름없음',
          phone: user.phone ? user.phone : '',
          fox: user.fox ? user.fox : 0,
        },
        access_token: this.jwtService.sign(payload),
      };

      return access_data;
    }
  }

  //로그아웃 리프레쉬 토크 null
  async removeRefreshToken(email: string, provider: string) {
    const user = await this.usersService.getRedundant(email);
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.usersService.setUpdateRefreshToken(email, provider, null);
  }

  //로그인 리프레쉬 토큰 저장
  async setCurrentRefreshToken(
    user_level: number,
    email: string,
    provider: string,
    refreshToken: string,
  ) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    if (user_level == 0) {
      return await this.usersService.setUpdateRefreshToken(
        email,
        provider,
        currentHashedRefreshToken,
      );
    } else {
      return await this.connectUsersService.setUpdateRefreshToken(
        email,
        provider,
        currentHashedRefreshToken,
      );
    }
  }

  //로그인 리프레쉬 토큰 저장
  async setLoginAt(user_level: number, email: string) {
    if (user_level == 0) {
      return await this.usersService.setLoginAt(email);
    } else {
      return await this.connectUsersService.setLoginAt(email);
    }
  }
}
