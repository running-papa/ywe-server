import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export enum requestType {
  BREAKDOWN = '고장',
  PRODUCT = '제품사용',
  REFUND = '환불',
  RETURN = '예약취소',
  OTHER = '기타',
}

export class ProductASRequestDto {
  @ApiProperty({ description: '설치된 부스 Id' })
  @IsNumber()
  productsId: number;

  @ApiProperty({
    description: '문의사항 타입',
    enum: requestType,
    example: [
      requestType.BREAKDOWN,
      requestType.PRODUCT,
      requestType.REFUND,
      requestType.RETURN,
      requestType.OTHER,
    ],
  })
  @IsString()
  type: requestType;

  @ApiProperty({ description: '문의내용' })
  @IsString()
  description: string;

  @ApiProperty({ description: '문의 사항이미지 base64 to image' })
  @IsArray()
  images: [string];
}

export class ProductEnquiryRequestDto {
  @ApiProperty({ description: '회사명' })
  @IsString()
  company: string;

  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '이메일' })
  @IsString()
  email: string;

  @ApiProperty({ description: '연락처' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '제목' })
  @IsString()
  subject: string;

  @ApiProperty({ description: '문의내용' })
  @IsString()
  description: string;
}
