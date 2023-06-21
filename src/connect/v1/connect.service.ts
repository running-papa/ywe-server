import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { UsersModel } from 'src/users/models/users.model';
import { Repository } from 'typeorm';
import { ConnectUserDto, ConnectUserUpdateDto } from '../dto/connect_user.dto';
import { ConnectUsersLoginModel } from '../models/connect_login.model';
import { ConnectUsersModel } from '../models/connect_users.model';

// import { BaseService } from "../../base/base.service";
// import { UserDto } from "./dto/user.dto";
// import { NotMatchUserException } from "../../custom_http_status";

@Injectable()
export class ConnectUsersService {
  constructor(
    @InjectRepository(ConnectUsersModel)
    private connectUserRepository: Repository<ConnectUsersModel>,
    @InjectRepository(ConnectUsersLoginModel)
    private connectUserLoginRepository: Repository<ConnectUsersLoginModel>,
  ) {}

  async findOne(uuid: string): Promise<ConnectUsersModel> {
    return await this.connectUserRepository.findOne({ uuid: uuid });
  }

  async findAll(): Promise<any> {
    return this.connectUserRepository.find({
      select: ['uuid', 'nickName', 'email', 'user_level', 'avatar'],
    });
  }

  async create(user: ConnectUserDto): Promise<any> {
    const user_check = await this.userId_find(user.provider, user.email);

    if (user_check != null) {
      return {
        statusCode: 401,
        message: '중복된 사용자입니다.',
      };
    }

    try {
      user.password = await bcrypt.hash(user.password, 10);

      const create_user = await this.connectUserRepository.save({
        provider: user.provider,
        email: user.email,
        password: user.password,
        phone: user.phone,
        nickName: user.nickName,
      });

      return {
        statusCode: 201,
        message: '회원가입 성공.',
      };
    } catch (error) {
      console.log('error = ', error);
      return {
        statusCode: 401,
        message: '회원가입 실패.',
      };
    }
  }

  async update(user, update: ConnectUserUpdateDto): Promise<any> {
    try {
      const data = await this.connectUserRepository.update(
        {
          email: user.email,
        },
        {
          phone: update.phone,
          nickName: update.nickName,
        },
      );

      return {
        statusCode: 201,
        message: '정보수정 성공.',
      };
    } catch (error) {
      console.log('update error = ', error);
      return {
        statusCode: 401,
        message: '정보수정 실패.',
      };
    }
  }

  async userId_find(provider: string, email: string) {
    return this.connectUserRepository.findOne({
      select: ['provider', 'email', 'nickName', 'phone'],
      where: { provider: provider, email: email },
    });
  }

  async matchUser(email: string): Promise<any> {
    return this.connectUserRepository.findOne({
      select: [
        'uuid',
        'provider',
        'nickName',
        'phone',
        'fox',
        'email',
        'password',
        'user_level',
      ],
      where: {
        email: email,
      },
    });
  }
  //리프레쉬 토큰 검증함수
  async matchRefreshToken(
    email: string,
    password: string,
    user_refreshToken: string,
  ): Promise<boolean> {
    const temp_refreshToken = await this.connectUserRepository.findOne({
      select: ['refreshToken'],
      where: {
        email: email,
        password: password,
      },
    });

    if (temp_refreshToken == null) return false;

    //저장된 토큰과 전달받은 토큰 비교
    const isRefreshTokenMatching = await bcrypt.compare(
      user_refreshToken,
      temp_refreshToken.refreshToken,
    );

    return isRefreshTokenMatching;
  }

  async password_auth(userId: string, authCode: string, name: string) {
    return this.connectUserRepository.count({
      where: { userId: userId, authCode: authCode, name: name },
    });
  }

  async getRedundant(email: string) {
    return this.connectUserRepository.count({
      where: { email: email },
    });
  }

  async setUpdateRefreshToken(
    email: string,
    provider: string,
    refreshToken: string | null,
  ) {
    return await this.connectUserRepository.update(
      {
        email: email,
        provider: provider,
      },
      {
        refreshToken: refreshToken,
      },
    );
  }
  async setLoginAt(email: string) {
    return await this.connectUserLoginRepository.save({
      email: email,
      loginAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  async chargingFox(user, fox) {
    try {
      const data = await this.connectUserRepository.update(
        {
          uuid: user.uuid,
        },
        {
          fox: fox,
        },
      );

      return data == null ? false : true;
    } catch (e) {
      console.log('chargingFox error', e);
      return false;
    }
  }

  async checkFox(user) {
    try {
      const data = await this.connectUserRepository.findOne({
        uuid: user.uuid,
      });

      let fox = 0;
      if (data.fox == null || data.fox == '') fox = 0;
      else fox = parseInt(data.fox);

      return fox;
    } catch (e) {
      console.log('checkFox error', e);
      return 0;
    }
  }

  async changePW(user, newPW) {
    try {
      const newPassword = await bcrypt.hash(newPW, 10);

      const data = await this.connectUserRepository.update(
        { email: user.email },
        {
          password: newPassword,
        },
      );

      return data;
    } catch (e) {
      console.log('changePW error', e);
      return 0;
    }
  }
}
