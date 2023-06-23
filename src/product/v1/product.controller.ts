import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { NormalJwtAuthGuard } from 'src/auth/guards/normal-jwt.guard';
import { ProductDto, ProductUpdateDto } from '../dto/product.dto';
import { ProductConfirmDto } from '../dto/productConfirm.dto';
import { ProductChringDto } from '../dto/productPayment.dto';
import { ProductService } from './product.service';
// import { productDto } from '../dto/product.dto';
// import {
//   productASRequestDto,
//   productEnquiryRequestDto,
// } from '../dto/productASRequest.dto';
// import { productConfirmDto } from '../dto/productConfirm.dto';
// import {
//   productNoticeDto,
//   productUpdateNoticeDto,
// } from '../dto/productNotice.dto';
// import { productPushDeleteDto, productPushDto } from '../dto/productPush.dto';
// import { productSlaveDto } from '../dto/productSlave.dto';
// import { productSlaveControlDto } from '../dto/productSlaveControl.dto';
// import { productTermsDto } from '../dto/productTerms.dto';
// import { productUpdateDto } from '../dto/productUpdate.dto';
// import { productService } from './product.service';

@Controller('v1/product')
@ApiTags('프로덕트 API')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: '전체 프로덕트 조회',
    description: '프로덕트 조회',
  })
  async getProductAll() {
    return await this.productService.getProductAll();
  }
  @Get('/:id')
  @ApiOperation({
    summary: '전체 프로덕트 조회',
    description: '프로덕트 조회',
  })
  @ApiParam({ name: 'id', example: 1 })
  async getProductDetail(@Param() params) {
    return await this.productService.getProductDetail(params.id);
  }

  @Post()
  @ApiOperation({
    summary: '신규 프로덕트 등록 및 저장',
    description: '프로덕트 등록 및 운영시간, 정보등등 저장',
  })
  @ApiCreatedResponse({ description: '신규 프로덕트 등록', type: ProductDto })
  async saveProduct(@Body() product: ProductDto) {
    return await this.productService.saveProduct(product); //, missionRoute);
  }

  @Put()
  @ApiOperation({
    summary: '프로덕트 정보 업데이트',
    description: '프로덕트 정보 업데이트',
  })
  @ApiCreatedResponse({
    description: '프로덕트 정보 업데이트',
    type: ProductUpdateDto,
  })
  async updateproduct(@Request() req, @Body() product: ProductUpdateDto) {
    return await this.productService.updateProduct(product); //, missionRoute);
  }

  //여우 충전
  @ApiBearerAuth()
  // @UseGuards(NormalJwtAuthGuard)
  @Post('/charging')
  @ApiOperation({
    summary: '유저 여우 충전',
    description: '비로그인 또는 로그인 유저 예약을 하기위한 여우 충전',
  })
  @ApiCreatedResponse({ description: '여우 충전', type: ProductChringDto })
  async chargingProduct(@Request() req, @Body() chring: ProductChringDto) {
    return await this.productService.chargingProduct(chring, req.user); //, missionRoute);
  }

  //커넥터 uuid 전달
  @Get('/reservation/:uuid')
  @ApiOperation({
    summary: '프로덕트 예약 조회',
    description: '커넥트의 예약된 날짜를 전달한다.',
  })
  @ApiQuery({ name: 'userUuid', example: 'cf044219-e471-4673-8924-0ba13d46b5fb' })
  async getReservationConnecter(@Param() param) {
    const id = param.id;
    const date = param.date;
    return await this.productService.getReservation(param.userUuid);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/reservation')
  @ApiOperation({
    summary: '개인 사용자의 프로덕트 예약 조회',
    description: '프로덕트 전달한다.',
  })
  @ApiQuery({ name: 'userUuid', example: 'cf044219-e471-4673-8924-0ba13d46b5fb' })
  async getReservation(@Param() param) {
   
    return await this.productService.getReservation(param.userUuid);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/reservation')
  @ApiOperation({
    summary: '예약',
    description:
      '내가 원하는 일자 하루를 예약한다. 필요한 프로덕트를 표시해주고 내용이 커넥터에게 전달된다',
  })
  @ApiCreatedResponse({
    description: '회원 예약 리스트 올리기',
    type: ProductConfirmDto,
  })
  async setReservation(@Body() data: ProductConfirmDto, @Req() req) {
    return await this.productService.setReservation(data, req.user); //, missionRoute);
  }

  // @Post('/slave')
  // @ApiOperation({
  //   summary: '프로덕트 slave 등록 및 저장',
  //   description: '프로덕트 slave 등록 및 운영시간, 정보등등 저장',
  // })
  // @ApiCreatedResponse({
  //   description: '프로덕트slave 등록',
  //   type: productSlaveDto,
  // })
  // async saveproductSlave(@Body() slave: productSlaveDto) {
  //   console.log(slave);
  //   return await this.productService.saveproductSlave(slave); //, missionRoute);
  // }

  // @Put('/slave-status')
  // @ApiOperation({
  //   summary: '보드에서 받아온 slave 상태값을 저장한다. ',
  //   description: '보드에서 받아온 slave 상태값을 저장한다.',
  // })
  // async updateSlaveStatus(@Body() data) {
  //   //@Body() data: productSlaveStatusDto) {
  //   //console.log('status data =', data);
  //   return await this.productService.updateSlaveStatus(data);
  // }
  // // @ApiBearerAuth()
  // // @UseGuards(JwtAuthGuard)
  // @Get()
  // @ApiOperation({
  //   summary: '프로덕트 리스트 조회',
  //   description: '프로덕트 리스트 전달한다.',
  // })
  // async getproduct(@Req() req) {
  //   return await this.productService.getproduct();
  // }

  // @Get('/detail/:id')
  // @ApiOperation({
  //   summary: '프로덕트 상세 조회',
  //   description: '프로덕트 상세 정보 전달한다.',
  // })
  // @ApiParam({ name: 'id', example: 1 })
  // async getproductDeetail(@Param() params) {
  //   return await this.productService.getproductDetail(params.id);
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/reservation')
  // @ApiOperation({
  //   summary: '프로덕트 예약',
  //   description: '프로덕트 시간 예약',
  // })
  // //@ApiCreatedResponse({ description: '신규 프로덕트 등록', type: productConfirmDto })
  // async setReservation(@Body() data: productConfirmDto, @Req() req) {
  //   const user = req.user;

  //   return await this.productService.setReservation(data, user); //, missionRoute);
  // }

  // @Get('/reservation')
  // @ApiOperation({
  //   summary: '프로덕트 예약 조회',
  //   description: '프로덕트 예약정보를 날짜별로 전달한다.',
  // })
  // @ApiQuery({ name: 'id', example: '1' })
  // @ApiQuery({ name: 'date', example: '20220718' })
  // async getReservation(@Req() req: Request) {
  //   const id = req.query.id;
  //   const date = req.query.date;
  //   return await this.productService.getReservation(id, date);
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/reservation-possible')
  // @ApiOperation({
  //   summary: '프로덕트 예약이 가능한지 여부 조회',
  //   description: '겹치는 예약이 있으면 false, 없으면 true 예약가능',
  // })
  // async checkReservation(@Body() data: productConfirmDto) {
  //   const isPossible = await this.productService.checkReservation(data);
  //   return isPossible;
  // }

  // //예약취소
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/reservation-cancel')
  // @ApiOperation({
  //   summary: '프로덕트 예약 취소',
  //   description: '프로덕트 예약정보를 취소한다. 예약 아이디값 쿼리 전달',
  // })
  // @ApiQuery({ name: 'id', example: '1' })
  // async getReservationCancel(@Req() req) {
  //   const reservationsId = req.query.id;
  //   const user = req.user;

  //   return await this.productService.getReservationCancel(reservationsId, user);
  // }

  // //반납완료
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/reservation-return')
  // @ApiOperation({
  //   summary: '프로덕트 예약 반납',
  //   description: '프로덕트 예약정보를 반납한다. 예약 아이디값 쿼리 전달',
  // })
  // @ApiQuery({ name: 'id', example: '1' })
  // async setReservationReturn(@Req() req) {
  //   const reservationsId = req.query.id;
  //   const user = req.user;

  //   return await this.productService.setReservationReturn(reservationsId);
  // }

  // //slave control
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/reservation-check')
  // @ApiOperation({
  //   summary: '프로덕트를 현재 이용중인지 여부',
  //   description: '프로덕트를 이용중이여만 controller 확인을 위해 만듬',
  // })
  // @ApiQuery({ name: 'id', example: '1' })
  // async getReservationCheck(@Req() req) {
  //   const reservationsId = req.query.id;
  //   const user = req.user;

  //   return await this.productService.getReservationCheck(reservationsId);
  // }
  // // //slave control
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/reservation-control')
  // @ApiOperation({
  //   summary: '프로덕트 slave control',
  //   description: '프로덕트 적용된 slave 에어컨, 등등의 컨트롤',
  // })
  // @ApiCreatedResponse({
  //   description: '프로덕트 slave control',
  //   type: productSlaveControlDto,
  // })
  // async getReservationReturn(@Body() control: productSlaveControlDto) {
  //   console.log('control = ', control);
  //   return await this.productService.setControl(control);
  // }

  // // @Post('/reservation-check1')
  // // @ApiOperation({
  // //   summary: '프로덕트 예약 체크테스트',
  // //   description: '프로덕트 예약정보를 취소한다. 예약 아이디값 쿼리 전달',
  // // })
  // // async getReservationCheck1(@Body() data: productConfirmDto) {
  // //   return await this.productService.checkReservation(data);
  // // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/push')
  // @ApiOperation({
  //   summary: '프로덕트 예약 푸시 메시지 저장',
  //   description: '프로덕트 예약 푸시메시지 클라이언트에서 받아서 저장 메소드',
  // })
  // async setPush(@Body() data: productPushDto, @Req() req) {
  //   const userUuid = req.user.uuid;
  //   return await this.productService.setPush(data, userUuid);
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/push-update')
  // @ApiOperation({
  //   summary: '프로덕트 예약 푸시 isChecked 자동 업데이트',
  //   description: '프로덕트 예약 푸시메시지 읽음 표시를 위한 업데이트',
  // })
  // async setPushUpdate(@Req() req) {
  //   const userUuid = req.user.uuid;

  //   return await this.productService.setPushUpdate(userUuid);
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/push-delete')
  // @ApiOperation({
  //   summary: '프로덕트 예약 푸시 메시지 삭제',
  //   description: '프로덕트 예약 푸시메시지 아이디로 전달받아서 삭제',
  // })
  // async setPushDelete(@Body() data: productPushDeleteDto, @Req() req) {
  //   const userUuid = req.user.uuid; //'93222a4c-a779-4503-bfc0-9c6e846e788d'; //req.user.uuid;

  //   return await this.productService.setPushDelete(data, userUuid);
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('/push')
  // @ApiOperation({
  //   summary: '프로덕트 예약 푸시 메시지 전달',
  //   description:
  //     '프로덕트 예약 푸시메시지 클라이언트에서 받아서 저장 된거 현재 시간 기준으로 파싱해서 전달',
  // })
  // async getPush(@Req() req) {
  //   const userUuid = req.user.uuid;
  //   return await this.productService.getPush(userUuid);
  // }

  // @Post('/notice')
  // @ApiOperation({
  //   summary: '프로덕트 공지사항 내용등록 ',
  //   description: '프로덕트 공지사항 내용 등록',
  // })
  // async setNotice(@Body() data: productNoticeDto) {
  //   console.log('data = ', data);
  //   const type = 'notice';

  //   return await this.productService.setNotice(data, type);
  // }

  // @Post('/event')
  // @ApiOperation({
  //   summary: '프로덕트 이벤트 내용등록 ',
  //   description: '프로덕트 이벤트 내용 등록',
  // })
  // async setEvent(@Body() data: productNoticeDto) {
  //   const type = 'event';

  //   return await this.productService.setNotice(data, type);
  // }

  // @Put('/notice')
  // @ApiOperation({
  //   summary: '프로덕트 공지사항 내용수정 ',
  //   description: '프로덕트 공지사항 내용 수정',
  // })
  // async updateNotice(@Body() data: productUpdateNoticeDto) {
  //   return await this.productService.updateNotice(data);
  // }

  // @Put('/event')
  // @ApiOperation({
  //   summary: '프로덕트 이벤트 내용수정 ',
  //   description: '프로덕트 이벤트 내용수정',
  // })
  // async updateEvent(@Body() data: productUpdateNoticeDto) {
  //   return await this.productService.updateNotice(data);
  // }
  // @Get('/notice')
  // @ApiOperation({
  //   summary: '프로덕트 공지사항 전체조회 ',
  //   description: '프로덕트 공지사항 전체조회',
  // })
  // async getNotice() {
  //   const type = 'notice';
  //   return await this.productService.getNotice(type);
  // }

  // @Get('/event')
  // @ApiOperation({
  //   summary: '프로덕트 이벤트 전체조회 ',
  //   description: '프로덕트 이벤트 전체조회',
  // })
  // async getEvent() {
  //   const type = 'event';
  //   return await this.productService.getNotice(type);
  // }
  // @Get('/notice/:id')
  // @ApiOperation({
  //   summary: '프로덕트 공지사항 조회 ',
  //   description: '프로덕트 공지사항 조회',
  // })
  // @ApiParam({ name: 'id', example: 1 })
  // async getNoticeDetail(@Param() params) {
  //   const type = 'notice';
  //   const id = params.id;
  //   console.log('id =====', id);
  //   return await this.productService.getNoticeDetail(type, id);
  // }

  // @Get('/event/:id')
  // @ApiOperation({
  //   summary: '프로덕트 이벤트 내용 조회',
  //   description: '프로덕트 이벤트 조회',
  // })
  // @ApiParam({ name: 'id', example: 1 })
  // async getEventDetail(@Param() params) {
  //   const type = 'event';
  //   const id = params.id;
  //   return await this.productService.getNoticeDetail(type, id);
  // }

  // @Post('/terms')
  // @ApiOperation({
  //   summary: '개인정보, 서비스이용약관, 위치정보동의 생성 ',
  //   description: '개인정보, 서비스이용약관, 위치정보동의 디비 생성',
  // })
  // async setTerms(@Body() data: productTermsDto) {
  //   return await this.productService.setTerms(data);
  // }

  // @Put('/terms')
  // @ApiOperation({
  //   summary: '개인정보, 서비스이용약관, 위치정보동의 수정 ',
  //   description: '개인정보, 서비스이용약관, 위치정보동의 수정',
  // })
  // async updateTerms(@Body() data: productTermsDto) {
  //   return await this.productService.updateTerms(data);
  // }
  // @Get('/terms')
  // @ApiOperation({
  //   summary: '개인정보, 서비스이용약관, 위치정보동의 조회',
  //   description: '개인정보, 서비스이용약관, 위치정보동의 조회',
  // })
  // async getTerms() {
  //   return await this.productService.getTerms();
  // }

  // @Put('/return-all/:productsId')
  // @ApiOperation({
  //   summary: '전체예약 반납으로 변경 ',
  //   description: '전체예약 반납으로 변경',
  // })
  // @ApiParam({ name: 'productsId', example: 1 })
  // async returnAll(@Param() params) {
  //   const productsId = params.productsId;
  //   return await this.productService.returnAll(productsId);
  // }

  // @Put('/checkEmergency/:productsId')
  // @ApiOperation({
  //   summary: '이멀젼시 테스트 ',
  //   description: '이멀젼시 테스트',
  // })
  // @ApiParam({ name: 'productsId', example: 1 })
  // async checkEmergency(@Param() params) {
  //   console.log('params = ', params);
  //   const productsId = params.productsId;
  //   return await this.productService.checkEmergency(productsId);
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/as-request')
  // @ApiOperation({
  //   summary: '프로덕트 메일로 문의하기',
  //   description: '프로덕트 메일로 문의하기',
  // })
  // async asRequest(@Body() data: productASRequestDto, @Req() req) {
  //   const user = req.user;

  //   return await this.productService.asRequest(data, user);
  // }

  // @Post('/enquiry-request')
  // @ApiOperation({
  //   summary: '프로덕트 구매상담 문의하기',
  //   description: '프로덕트 구매상담 문의하기',
  // })
  // async enquiryRequest(@Body() data: productEnquiryRequestDto, @Req() req) {
  //   return await this.productService.enquiryRequest(data);
  // }
}
