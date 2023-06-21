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
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { NormalJwtAuthGuard } from 'src/auth/guards/normal-jwt.guard';
import { UsersModel } from '../models/users.model';
import { UserDto, UserUpdateDto } from '../dto/user.dto';
import { UserChangePWDto } from '../dto/user_changePW.dto copy';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@Controller('v1/users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @ApiOperation({ summary: '유저 생성 API', description: '유저 회원가입.' })
  async create(@Body() user: UserDto): Promise<UsersModel> {
    return await this.usersService.create(user);
  }

  @ApiBearerAuth()
  // @UseGuards(NormalJwtAuthGuard)
  @Put('/')
  @ApiOperation({
    summary: '유저 정보수정 API',
    description: '유저 정보 수정.',
  })
  async update(
    @Request() req,
    @Body() update: UserUpdateDto,
  ): Promise<UsersModel> {
    return await this.usersService.update(req.user, update);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저 정보조회 API',
    description: 'access token 으로 내 정보 조회 api.',
  })
  @Get('/')
  async getProfile(@Request() req) {
    console.log(req.user);
    const data = await this.usersService.findOne(req.user.uuid);

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
  // @UseGuards(NormalJwtAuthGuard)
  @ApiOperation({
    summary: '유저 비밀번호 변경',
    description: '유저 기존 비밀번호에서 신규 비밀번호로 변경.',
  })
  @Put('/password_change')
  @ApiCreatedResponse({
    description: '유저 비밀번호 변경',
    type: UserChangePWDto,
  })
  async password_change(
    @Request() req,
    @Body() afterPassword: UserChangePWDto,
  ): Promise<any> {
    const beforePassword = await this.usersService.findOne(req.user.email);
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

    return await this.usersService.changePW(
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

    return await this.usersService.changePW(user, password);
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
