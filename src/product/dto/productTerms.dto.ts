import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ProductTermsDto {
  @ApiProperty({ description: '개인정보 수집동의' })
  @IsString()
  privacy: string;

  @ApiProperty({ description: '서비스 이용약관' })
  @IsString()
  service: string;

  @ApiProperty({ description: '위치정보 수집동의 이용약관' })
  @IsString()
  location: string;

  @ApiProperty({ description: '취소 환불 규정 약관' })
  @IsString()
  payment: string;
}
