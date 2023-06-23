import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export enum ProductMethod {
  MAIN = 'MAIN', //'메인 비지니스 모델',
  SERVICE = 'SERVICE', //서비스 기능들,
  CHARGING = 'CHARGING' //충전 서비스
 }

export enum ProductCode {
  RIDING_SERVICE_ONLY = 'RIDING_SERVICE_ONLY', //'라이딩서비스만온니',
  FULL_SERVICE = 'FULL_SERVICE', //원하는지역에 집,차,은행,마트 등컨택, 사용중 번역서비스 포함
}

export enum ProductServiceCode {
  RENT_HOUSE_VIEWING = 'RENT_HOUSE_VIEWING', //'렌트집 뷰잉',
  RENT_VICLE_VIEWING = 'RENT_VICLE_VIEWING', //'렌트카 뷰잉',
  AIRPORT_PICKUP = 'AIRPORT_PICKUP', //'공항픽업',
  UTILITY_PURCHASE = 'UTILITY_PURCHASE', //'유틸리티 신청(가스,전기,티비)',
  LICENSES_CREATE = 'LICENSES_CREATE', //'은행계좌 개설, 체크카드신청, 면허증',
  OTHER = 'OTHER', //'기타',
}

export enum ProductChagingCode {
  FOX_1 = 'FOX_1', //'1',
  FOX_5 = 'FOX_5', //'5',
  FOX_10 = 'FOX_10', //'10',
}
export class ProductDto {
  @ApiProperty({
    description: '프로덕트 Code',
  })
  @IsString()
  code: string;

  @ApiProperty({ description: '기능' })
  @IsString()
  method: ProductMethod;

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
      ProductCode.RIDING_SERVICE_ONLY,
      ProductCode.FULL_SERVICE,
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
