import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class ProductReservationDto {
  @ApiProperty({ description: '설치된 부스 Id', example: 1 })
  @IsNumber()
  productId: number;

  @ApiProperty({ description: '공유부스 예약 날짜', example: '20220718' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: '공유부스 예약 시작시간', example: '1200' })
  @IsString()
  time_min: string;

  @ApiProperty({ description: '공유부스 예약 종료시간', example: '1400' })
  @IsString()
  time_max: string;
}
