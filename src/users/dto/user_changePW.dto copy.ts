import {
  IsString,
  IsNumber,
  IsEmpty,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserChangePWDto {
  @ApiProperty({ description: 'password', example: '123123123' })
  @IsString()
  password: string | null;

  @ApiProperty({ description: 'password', example: '123123123' })
  @IsString()
  newPassword: string | null;
}
