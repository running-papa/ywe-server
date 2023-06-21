import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

//보안 security
//자동문 잠금장치 , cctv

//편의 convenience
//냉난방기 , 공기청정기 , 전자칠판 , 충전기 , 어닝 , 와이파이 , 해충방지 , 화이트보드
export enum slaveCode {
  DOOR = 'DOOR',
  CCTV = 'CCTV',

  AIRCONDITIONER = 'AIRCONDITIONER',
  HEATER = 'HEATER',
  ARIPURIFIER = 'AIRPURIFIER',
  ELECTRONIC_BLACKBOARD = 'ELECTRONIC_BLACKBOARD',
  WHITEBOARD = 'WITEBOARD',
  CHARGER = 'CHARGER',
  AWNING = 'AWNING',
  WIFI = 'WIFI',
  PEST_CONTROL = 'PEST_CONTROL',
  ALLTIME = 'ALLTIME',
  BLIND = 'BLIND',
  LIGHT = 'LIGHT',

  SYSTEMCONTROL = 'SYSTEMCONTROL',
}

export enum slaveMode {
  Air_Mode_Cooling = '0', //0 냉방
  Air_Mode_Heating = '1', //1 난방
  Air_Mode_Auto = '2', //2 자동
}

export enum slaveWindSpeed {
  Air_Wind_Auto = '0', //0 자동
  Air_Wind_Small = '1', //1 약
  Air_Wind_Middle = '2', //2 중
  Air_Wind_Big = '3', //3 강
}

export class ProductSlaveDto {
  @ApiProperty({ description: '설치된 부스 Id' })
  @IsNumber()
  productsId: number;

  @ApiProperty({ description: 'slave 타입(sensor, device)' })
  @IsString()
  slaveType: string;

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
      slaveCode.BLIND,
      slaveCode.LIGHT,
    ],
  })
  @IsString()
  code: slaveCode;

  @ApiProperty({ description: 'slave 상품명' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'slave 설명' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'slave 전원 on,off' })
  @IsBoolean()
  onoff: boolean;

  @ApiProperty({ description: 'slave 설정온도' })
  @IsNumber()
  temperature: number;

  @ApiProperty({
    description:
      'AIRCONDITIONER //0: 냉방, 1: 난방, 2: 자동  ' +
      'SYSTEMCONTROL: //mode : 0 전체 시스템 종료, 1 전체 시스템 On  ' +
      'DOOR :   //mode: 0 문닫힘, 1 문열림  ' +
      'AWNING :  //mode: 0 어닝닫힘, 1 어닝열림  ' +
      'BLIND :  //mode: 0 블라인더 닫힘, 1 블라인더열림, 2 블라인더스탑  ' +
      'LIGHT : //mode: 0 불꺼짐, 1 불켜짐  ',
    enum: slaveMode,
    example: [
      slaveMode.Air_Mode_Cooling,
      slaveMode.Air_Mode_Heating,
      slaveMode.Air_Mode_Auto,
    ],
  })
  @IsString()
  mode: slaveMode;

  @ApiProperty({
    description: 'slave 바람세기 //0: 자동, 1: 1단, 2: 2단, 3: 3단',
    enum: slaveWindSpeed,
    example: [
      slaveWindSpeed.Air_Wind_Auto,
      slaveWindSpeed.Air_Wind_Small,
      slaveWindSpeed.Air_Wind_Middle,
      slaveWindSpeed.Air_Wind_Big,
    ],
  })
  @IsString()
  airWindSpeed: slaveWindSpeed;
}

export class ProductSlaveStatusDto {
  @ApiProperty({ description: '설치된 부스의 제어 가능한 slaveId' })
  @IsString()
  slaveId: string;

  @ApiProperty({ description: 'slave 제어 상태' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'slave 제어 상태값 받아온 시간' })
  @IsString()
  status_checkDate: string;
}
