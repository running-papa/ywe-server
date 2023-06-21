import {
  Controller,
  UseGuards,
  Put,
  Req,
  Post,
  Body,
  Get,
  Request,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ConnectUsersService } from './connect.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { ConnectJwtAuthGuard } from 'src/auth/guards/connect-jwt.guard';
import { ConnectUsersModel } from '../models/connect_users.model';

import * as bcrypt from 'bcrypt';
import { ConnectUserDto, ConnectUserUpdateDto } from '../dto/connect_user.dto';
import { ConnectUserChangePWDto } from '../dto/connect_user_changePW.dto copy';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('v1/connect')
@ApiTags('connect 유저 API')
export class ConnectUsersController {
  constructor(private readonly connectUsersService: ConnectUsersService) {}

  @Post('/')
  @ApiOperation({
    summary: 'connect 유저 생성 API',
    description: 'connect 유저 회원가입.',
  })
  async create(@Body() user: ConnectUserDto): Promise<ConnectUsersModel> {
    return await this.connectUsersService.create(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/')
  @ApiOperation({
    summary: 'connect 유저 정보수정 API',
    description: 'connect 유저 정보 수정.',
  })
  async update(
    @Request() req,
    @Body() update: ConnectUserUpdateDto,
  ): Promise<ConnectUsersModel> {
    return await this.connectUsersService.update(req.user, update);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'connect 유저 정보조회 API',
    description: 'access token 으로 내 정보 조회 api.',
  })
  @Get('/')
  async getProfile(@Request() req) {
    console.log('커넥트 유저 조회 = ', req.user);

    const data = await this.connectUsersService.findOne(req.user.uuid);

    const user = {
      statusCode: 201,
      message: '조회성공',
      data: {
        uuid: data.uuid,
        provider: data.provider,
        nickName: data.nickName,
        email: data.email,
        fox: data.fox,
        phone: data.phone,
      },
    };
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'connect 유저 전체조회 API',
    description: 'access token 으로 내 정보 조회 api.',
  })
  @Get('/all')
  async getConnectUserAll(@Request() req) {
    const data = await this.connectUsersService.findAll();

    const connect_users = {
      statusCode: 201,
      message: '조회성공',
      data: {
        connect_users: data,
      },
    };
    return connect_users;
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({
  //   summary: 'connect 유저 전체조회 API',
  //   description: 'access token 으로 내 정보 조회 api.',
  // })
  // @Get('/schejule/:connecter')
  // async getConnectUserSchejule(@Request() req) {
  //   const data = await this.connectUsersService.findAll();

  //   const connect_users = {
  //     statusCode: 201,
  //     message: '조회성공',
  //     data: {
  //       connect_users: data,
  //     },
  //   };
  //   return connect_users;
  // }

  @ApiBearerAuth()
  // @UseGuards(ConnectJwtAuthGuard)
  @ApiOperation({
    summary: 'connect 유저 비밀번호 변경',
    description: 'connect 유저 기존 비밀번호에서 신규 비밀번호로 변경.',
  })
  @Put('/password_change')
  @ApiCreatedResponse({
    description: 'connect 유저 비밀번호 변경',
    type: ConnectUserChangePWDto,
  })
  async password_change(
    @Request() req,
    @Body() afterPassword: ConnectUserChangePWDto,
  ): Promise<any> {
    const beforePassword = await this.connectUsersService.findOne(
      req.user.email,
    );
    const isMatch = await bcrypt.compare(
      afterPassword.password,
      beforePassword.password,
    );

    if (isMatch == false) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'BAD_REQUEST',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.connectUsersService.changePW(
      req.user,
      afterPassword.newPassword,
    );
  }

  @Get('/:userId')
  async getUser(@Param() params): Promise<any> {
    console.log('getUser', params.userId);
    if (params.userId == null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'BAD_REQUEST',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //return await this.userService.readUser(params.userId);
    return '';
  }

  @Put('/changePW')
  async changePW(@Request() req) {
    const email = 'asdf@gmail.com';
    const user = {
      email: email,
    };
    const password = '123123123';

    return await this.connectUsersService.changePW(user, password);
  }

  //   @Put("name")
  //   changeNickname(@Req() req) {
  //     const user = req.user;
  //     console.log(req.body);
  //     user.name = req.body.name;

  //     return this.userService.changeNickname(user);
  //   }

  //   @Put("password")
  //   changePassword(@Req() req) {
  //     const user = req.user;
  //     user.password = req.body.password;
  //     user.changed = req.body.changed;

  //     return this.userService.changePassword(user);
  //   }
}
