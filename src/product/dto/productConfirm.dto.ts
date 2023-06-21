import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
} from 'class-validator';
import { ProductCode } from './product.dto';

export enum reservationCode {
  WATING = '예약대기중',
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

  @ApiProperty({
    description: '원하는 프로젝트 미리 체크',
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
      ProductCode.OTHER,
    ],
  })
  @IsArray()
  product: string[];

  @ApiProperty({
    description: '추가 예약사항',
    example: '집뷰잉, 차뷰잉, 하고싶어요',
  })
  @IsString()
  description: string;

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

  @ApiProperty({
    description: '예약할 커넥터 uuid',
    example: 'cf044219-e471-4673-8924-0ba13d46b5fb',
  })
  @IsString()
  connecter_uuid: string;
  //   @ApiProperty({ description: '환불여부' })
  //   @IsBoolean()
  //   refund: boolean;

  //   @ApiProperty({ description: '환불 완료 날짜' })
  //   @IsDate()
  //   refund_date: Date | null;
}
