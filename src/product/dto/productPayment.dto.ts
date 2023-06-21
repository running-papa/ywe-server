import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export enum ProductChringCode {
  FOX_1 = 1, //'1여우',
  FOX_5 = 2, // '5여우',
  FOX_10 = 3, //'10여우',
}

export class ProductChringDto {
  @ApiProperty({
    description: '프로덕트 Id',
    example: [
      ProductChringCode.FOX_1,
      ProductChringCode.FOX_5,
      ProductChringCode.FOX_10,
    ],
  })
  @IsNumber()
  productsId: ProductChringCode;
}
