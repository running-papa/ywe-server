import {
  IsString,
  IsNumber,
  IsEmpty,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectUserDto {
  @ApiProperty({
    description: '3rd party 제공자 ( google, iOS )',
    example: 'google',
  })
  @IsString()
  provider: string;

  @ApiProperty({ description: 'email', example: 'asdf@gmail.com' })
  @IsString()
  email: string | null;

  @ApiProperty({ description: 'password', example: '123123123' })
  @IsString()
  password: string | null;

  @ApiProperty({ description: '휴대폰 번호', example: '01012341234' })
  @IsString()
  phone: string | null;

  @ApiProperty({ description: 'nickName', example: '닉네임1' })
  @IsString()
  nickName: string | null;
}

export class ConnectUserUpdateDto {
  @ApiProperty({ description: '휴대폰 번호', example: '01012341234' })
  @IsString()
  phone: string | null;

  @ApiProperty({ description: 'nickName', example: '닉네임1' })
  @IsString()
  nickName: string | null;
}
