import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class ProductPushDetailDto {
  @ApiProperty({ description: '클라이언트 전달 푸시ID' })
  @IsString()
  pushId: string;

  @ApiProperty({ description: '클라이언트 전달 알림시간' })
  @IsString()
  sendTime: string;

  @ApiProperty({ description: '클라이언트 전달 메시지 타이틀' })
  @IsString()
  msgTitle: string;

  @ApiProperty({ description: '클라이언트 전달 메시지' })
  @IsString()
  msg: string;

  @ApiProperty({ description: '클라이언트 확인 플래그' })
  @IsBoolean()
  isChecked: boolean;

  @ApiProperty({ description: '유저 uuid' })
  @IsString()
  userUuid: string;
}

export class ProductPushDto {
  @ApiProperty({ description: '삭제할 푸시ID' })
  @IsArray()
  data: ProductPushDetailDto[];
}

export class ProductPushDeleteDto {
  @ApiProperty({ description: '삭제할 푸시ID 배열' })
  @IsArray()
  data: string[];
}
