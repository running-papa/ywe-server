import { ApiProperty } from '@nestjs/swagger';
//import {IsString, IsEmail} from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'email', example: 'asdf@gmail.com' })
  email: string;

  @ApiProperty({ description: 'password', example: '123123123' })
  password: string;

  @ApiProperty({ description: 'user_level', example: '0' })
  user_level: string;
}
