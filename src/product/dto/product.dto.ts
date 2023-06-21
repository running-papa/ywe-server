import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export enum ProductCode {
  RENT_HOUSE_SERCH = 'RENT_HOUSE_SERCH', //'렌트서칭작업',
  RENT_HOUSE_VIWING = 'RENT_HOUSE_VIWING', //'렌트집 뷰잉',
  RENT_VICLE_SERCH = 'RENT_VICLE_SERCH', //'렌트카서칭작업',
  RENT_VICLE_VIWING = 'RENT_VICLE_VIWING', //'렌트카 뷰잉',
  AIRPORT_PICKUP = 'AIRPORT_PICKUP', //'공항픽업',
  UTILITY_PURCHASE = 'UTILITY_PURCHASE', //'유틸리티 신청(가스,전기,티비)',
  LICENSES_CREATE = 'LICENSES_CREATE', //'은행계좌 개설, 체크카드신청, 면허증',
  SCHOOL_REGISTRATION = 'SCHOOL_REGISTRATION', //'학교등록',
  DOCUMENT_CREATE = 'DOCUMENT_CREATE', // 문서 작성
  FOX_1 = 'FOX_1', //'1여우',
  FOX_5 = 'FOX_5', // '5여우',
  FOX_10 = 'FOX_10', //'10여우',
  FOX_YOUTUBE = 'FOX_YOUTUBE', //'1여우',
  OTHER = 'OTHER', //'기타',
}

export class ProductDto {
  @ApiProperty({
    description: '프로덕트 Code',
    enum: ProductCode,
    example: [
      ProductCode.RENT_HOUSE_SERCH,
      ProductCode.RENT_HOUSE_VIWING,
      ProductCode.RENT_VICLE_SERCH,
      ProductCode.RENT_VICLE_VIWING,
      ProductCode.AIRPORT_PICKUP,
      ProductCode.UTILITY_PURCHASE,
      ProductCode.LICENSES_CREATE,
      ProductCode.SCHOOL_REGISTRATION,
      ProductCode.DOCUMENT_CREATE,
      ProductCode.FOX_1,
      ProductCode.FOX_5,
      ProductCode.FOX_10,
      ProductCode.OTHER,
    ],
  })
  @IsString()
  code: ProductCode;

  @ApiProperty({ description: '프로덕트명' })
  @IsString()
  name: string;

  @ApiProperty({ description: '이용금액' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '이용시 유의사항' })
  @IsString()
  precautions_used: string;

  @ApiProperty({ description: '취소및 환불규정' })
  @IsString()
  precautions_payment: string;
}

export class ProductUpdateDto {
  @ApiProperty({ description: '부스 ID', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '프로덕트 Code',
    enum: ProductCode,
    example: [
      ProductCode.RENT_HOUSE_SERCH,
      ProductCode.RENT_HOUSE_VIWING,
      ProductCode.RENT_VICLE_SERCH,
      ProductCode.RENT_VICLE_VIWING,
      ProductCode.AIRPORT_PICKUP,
      ProductCode.UTILITY_PURCHASE,
      ProductCode.LICENSES_CREATE,
      ProductCode.SCHOOL_REGISTRATION,
      ProductCode.DOCUMENT_CREATE,
      ProductCode.FOX_1,
      ProductCode.FOX_5,
      ProductCode.FOX_10,
      ProductCode.OTHER,
    ],
  })
  @IsString()
  code: ProductCode;

  @ApiProperty({ description: '프로덕트명' })
  @IsString()
  name: string;

  @ApiProperty({ description: '이용금액' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '이용시 유의사항' })
  @IsString()
  precautions_used: string;

  @ApiProperty({ description: '취소및 환불규정' })
  @IsString()
  precautions_payment: string;
}
