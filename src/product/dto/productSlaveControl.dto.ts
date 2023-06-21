import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, ValidateIf } from 'class-validator';
import { slaveMode, slaveCode, slaveWindSpeed } from './productSlave.dto';

//보안
//자동문 잠금장치 , cctv

//편의
//냉난방기 , 공기청정기 , 전자칠판 , 충전기 , 어닝 , 와이파이 , 해충방지 , 화이트보드

export class ProductSlaveControlDto {
  @ApiProperty({
    description: '예약 번호',
    example: '150',
  })
  @IsNumber()
  reservationId: number;

  @ApiProperty({
    description: 'slave 아이디 ( 예 : 에어컨아이디 136, 전원시스템 137)',
    example: '136',
  })
  @IsString()
  slaveId: string;

  @ApiProperty({ description: '설치된 부스 Id', example: 1 })
  @IsNumber()
  productsId: number;

  @ApiProperty({
    description: 'slave 코드',
    enum: slaveCode,
    example: [
      slaveCode.DOOR,
      slaveCode.CCTV,
      slaveCode.AIRCONDITIONER,
      slaveCode.HEATER,
      slaveCode.ARIPURIFIER,
      slaveCode.ELECTRONIC_BLACKBOARD,
      slaveCode.WHITEBOARD,
      slaveCode.CHARGER,
      slaveCode.AWNING,
      slaveCode.WIFI,
      slaveCode.PEST_CONTROL,
      slaveCode.ALLTIME,
      slaveCode.SYSTEMCONTROL,
    ],
  })
  @IsString()
  code: slaveCode;

  @ApiProperty({ description: 'slave 전원 on,off', example: true })
  @IsBoolean()
  onoff: boolean;

  @ApiProperty({
    description: 'slave 설정온도 (에어컨전용)',
    example: [24, null],
  })
  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  temperature!: number | null;

  @ApiProperty({
    description: 'slave 바람모드 (에어컨전용)',
    example: [
      slaveMode.Air_Mode_Auto,
      slaveMode.Air_Mode_Cooling,
      slaveMode.Air_Mode_Heating,
      null,
    ],
  })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  mode!: string | null;

  @ApiProperty({
    description: 'slave 바람세기 (에어컨전용)',
    example: [
      slaveWindSpeed.Air_Wind_Auto,
      slaveWindSpeed.Air_Wind_Small,
      slaveWindSpeed.Air_Wind_Middle,
      slaveWindSpeed.Air_Wind_Big,
      null,
    ],
  })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  airWindSpeed!: string | null;
}
