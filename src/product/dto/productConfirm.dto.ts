import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
} from 'class-validator';
import { ProductCode, ProductServiceCode } from './product.dto';

export enum reservationCode {
  WATING = '입찰중',
  COMPLETE = '예약완료',
  CANCEL = '예약취소',
  USED = '이용중',
  CHECK = '예약조회',
}

export class ProductConfirmDto {
  @ApiProperty({ description: '예약 날짜 year', example: '2023' })
  @IsString()
  year: string;

  @ApiProperty({ description: '예약 날짜 month', example: '01' })
  @IsString()
  month: string;

  @ApiProperty({ description: '예약 날짜 day', example: '10' })
  @IsString()
  day: string;

  @ApiProperty({ description: '예약 날짜 StartTime', example: '10' })
  @IsString()
  startTime: string;

  @ApiProperty({ description: '예약 날짜 endTime', example: '15' })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: '원하는 메인 서비스 종류 선택',
    enum: ProductCode,
    example: [
      ProductCode.RIDING_SERVICE_ONLY,
      ProductCode.FULL_SERVICE,
    ],
  })
  @IsString()
  product_main: string;

  @ApiProperty({
    description: '집뷰잉 boolean',
  })
  @IsBoolean()
  product_house_viwing: boolean;

  @ApiProperty({
    description: '차뷰잉 boolean',
  })
  @IsBoolean()
  product_vicle_viewing: boolean;

  @ApiProperty({
    description: '공항픽업 boolean',
  })
  @IsBoolean()
  product_airport_pickup: boolean;

  @ApiProperty({
    description: '유틸리티 신청 boolean',
  })
  @IsBoolean()
  product_utility_purchase: boolean;

  @ApiProperty({
    description: '운전면허, 통장 boolean',
  })
  @IsBoolean()
  product_licenses_create: boolean;

  @ApiProperty({
    description: '그외 요청사항 텍스트',
  })
  @IsString()
  product_other: string;

  @ApiProperty({
    description: '예약 현황',
    enum: reservationCode,
    example: [
      reservationCode.WATING,
      reservationCode.COMPLETE,
      reservationCode.CANCEL,
      reservationCode.CHECK,
    ],
  })
  @IsString()
  method: string;
}
