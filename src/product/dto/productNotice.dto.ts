import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class ProductNoticeDto {
  @ApiProperty({ description: '게시판 타이틀' })
  @IsString()
  title: string;

  @ApiProperty({ description: '게시판 내용' })
  @IsString()
  description: string;

  @ApiProperty({ description: '게시판 작성자' })
  @IsString()
  writer: string;
}

export class ProductUpdateNoticeDto {
  @ApiProperty({ description: '게시판 타이틀' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '게시판 타이틀' })
  @IsString()
  title: string;

  @ApiProperty({ description: '게시판 내용' })
  @IsString()
  description: string;
}
