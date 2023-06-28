import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';


export enum businessType {
    BASIC = 'BASIC',
    PREMIUM = 'PREMIUM',
}

export enum advertiseType {
    REALESTATE = 'REALESTATE',
    VICLE = 'VICLE',
    YOUTUBE = 'YOUTUBE',
    RESTAURANT = 'RESTAURANT'
}

export class ProductAdvertiseDto {
  @ApiProperty({ description: '광고 타이틀' })
  @IsString()
  name: string;

  //일반, 골드, 플레티넘, 다이아
  @ApiProperty({ description: '비지니스 타입' , 
                 example : [businessType.BASIC, businessType.PREMIUM]})
  @IsString()
  business_type: string;

  //부동산, 차량, 유튜브, 식당, 등등
  @ApiProperty({ description: '광고타입', 
                example : [advertiseType.REALESTATE, advertiseType.VICLE,advertiseType.YOUTUBE,advertiseType.RESTAURANT] })
  @IsString()
  advertise_type: string;

  @ApiProperty({ description: '썸네일 url' })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({ description: '광고 url' })
  @IsString()
  advertiseUrl: string;


}

export class ProductUpdateAdvertiseDto {
  @ApiProperty({ description: '게시판 타이틀' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '광고 타이틀' })
  @IsString()
  name: string;

  //일반, 골드, 플레티넘, 다이아
  @ApiProperty({ description: '비지니스 타입' })
  @IsString()
  business_type: string;

  //부동산, 차량, 유튜브, 식당, 등등
  @ApiProperty({ description: '광고타입' })
  @IsString()
  advertise_type: string;

  @ApiProperty({ description: '썸네일 url' })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({ description: '광고 url' })
  @IsString()
  advertiseUrl: string;

}
