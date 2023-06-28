import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import { UsersService } from 'src/users/v1/users.service';
import { In, Repository } from 'typeorm';
import { ProductChagingCode, ProductCode, ProductDto, ProductUpdateDto } from '../dto/product.dto';
import { ProductConfirmDto, reservationCode } from '../dto/productConfirm.dto';
import { ProductChringDto } from '../dto/productPayment.dto';
import { ProductModel } from '../models/product.model';
import { ProductChargingModel } from '../models/product_charging.model';
import { ProductPaymentModel } from '../models/product_payment.model';
import { ProductReservationModel } from '../models/product_reservation.model';
import { ProductAdvertiseModel } from '../models/product_advertise.model';
import { advertiseType, businessType } from '../dto/productAdvertise.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @InjectRepository(ProductModel)
    private productRepository: Repository<ProductModel>,
    @InjectRepository(ProductPaymentModel)
    private paymentRepository: Repository<ProductPaymentModel>,
    @InjectRepository(ProductReservationModel)
    private reservationRepository: Repository<ProductReservationModel>,
    @InjectRepository(ProductChargingModel)
    private chargingRepository: Repository<ProductChargingModel>, // @InjectRepository(ProductPushModel) // private pushRepository: Repository<ProductPushModel>, // @InjectRepository(ProductNoticeModel) // private noticeRepository: Repository<ProductNoticeModel>, // @InjectRepository(ProductTermsModel) // private termsRepository: Repository<ProductTermsModel>,
    @InjectRepository(ProductAdvertiseModel)
    private advertiseRepository: Repository<ProductAdvertiseModel>,
  
    ) {}

  async saveProduct(product: ProductDto) {
    try {
      const data = await this.productRepository.save({
        code: product.code,
        name: product.name,
        price: product.price,
        precautions_used: product.precautions_used,
        precautions_payment: product.precautions_payment,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate(),
      });

      if (data != null) {
        return {
          statusCode: 201,
          message: '데이터 저장 성공.',
        };
      } else {
        return {
          statusCode: 401,
          message: '데이터 저장 실패.',
        };
      }
    } catch (e) {
      console.log('setProduct catch error', e);
      return {
        statusCode: 401,
        message: '데이터 저장 실패.',
      };
    }
  }
  async getProductAll() {
    //오늘 날짜 만 조회했을시 부스 디테일에서 제공
    try {
      const product = await this.productRepository.find();

      if (product != null) {
        return {
          statusCode: 201,
          message: '데이터 조회성공.',
          data: {
            products: product,
          },
        };
      } else {
        return {
          statusCode: 401,
          message: '데이터 조회실패',
        };
      }
    } catch (e) {
      console.log('getProductAll error', e);
      return {
        statusCode: 401,
        message: '데이터 조회실패',
      };
    }
  }
  async getProductDetail(id) {
    //오늘 날짜 만 조회했을시 부스 디테일에서 제공
    try {
      const product = await this.productRepository.findOne({
        where: {
          id: id,
        },
      });

      if (product != null) {
        return {
          statusCode: 201,
          message: '데이터 조회성공.',
          data: product,
        };
      } else {
        return {
          statusCode: 401,
          message: '데이터 조회실패',
        };
      }
    } catch (e) {
      console.log('getProductDetail error', e);
      return {
        statusCode: 401,
        message: '데이터 조회실패',
      };
    }
  }

  async updateProduct(product: ProductUpdateDto) {
    try {
      const beforeproduct = await this.getProductDetail(product.id);

      const data = await this.productRepository.update(
        {
          id: product.id,
        },
        {
          code: product.code == null ? beforeproduct.data.code : product.code,
          name: product.name == null ? beforeproduct.data.name : product.name,
          price:
            product.price == null ? beforeproduct.data.price : product.price,
          precautions_used:
            product.precautions_used == null
              ? beforeproduct.data.precautions_used
              : product.precautions_used,
          precautions_payment:
            product.precautions_payment == null
              ? beforeproduct.data.precautions_payment
              : product.precautions_payment,
          updatedAt: moment().toDate(),
        },
      );

      if (data != null) {
        return {
          statusCode: 201,
          message: '데이터 업데이트 성공.',
        };
      } else {
        return {
          statusCode: 401,
          message: '데이터 업데이트 실패.',
        };
      }
    } catch (e) {
      console.log('updateProduct error ', e);
      return {
        statusCode: 401,
        message: '데이터 업데이트 실패.',
      };
    }
  }
  //충전을 하게되면 유저 테이블에 충전되고, 페이먼트 추가, 차징 테이블에 추가
  async chargingProduct(chargindDto: ProductChringDto, user) {
    try {
      const product = await this.productRepository.findOne({
        id: chargindDto.productsId,
      });

      if (product == null) {
        return {
          statusCode: 401,
          message: '저장된 프로덕트가 없습니다.',
        };
      }

      //1. 결재 모듈 연동
      const paymentModule = true;
      const paymentModule_date = moment().toDate();
      // if (paymentModule == false )
      // {
      //   return {
      //     statusCode : 403,
      //     message : '결재 취소'
      //   }
      // }
      //2. 결재 모듈에서 인증 완료후 차징 테이블에 데이터 저장
      const charging = await this.chargingRepository.save({
        userUuid: user.uuid,
        productsId: chargindDto.productsId,
        payment: paymentModule,
        payment_date: paymentModule_date,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate(),
      });
      //3. 유저 테이블에 여우+ 해주기
      let fox = 0;
      switch (product.code) {
        case ProductChagingCode.FOX_1:
          fox = 1;
          break;
        case ProductChagingCode.FOX_5:
          fox = 5;
          break;
        case ProductChagingCode.FOX_10:
          fox = 10;
          break;
      }

      // if (chargindDto.isYoutube == true) {
      //   fox = fox + 2;
      // }

      const chargingFox = await this.usersService.chargingFox(user, fox);
      //저장 실패시 예외처리 필요 할듯 결재 취소를 진행해야할지 ..
      // if (chargingFox == false) {
      //   return {
      //     statusCode: 401,
      //     message: '유저 데이터 저장 실패.',
      //   };
      // }

      //4. 페이먼트 페이지에 결재 내역 기록하기
      const payment = await this.paymentRepository.save({
        productsId: product.id,
        reservationsId: null,
        userUuid: user.uuid,
        payment: paymentModule,
        price: product.price,
        precautions_used: product.precautions_used,
        precautions_payment: product.precautions_payment,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate(),
      });

      if (charging != null && chargingFox != null && payment != null) {
        return {
          statusCode: 201,
          message: '충전이 완료 되었습니다.',
        };
      } else {
        let error_message = '';

        if (charging == null) error_message += ' 결재 완료 저장 실패';

        if (chargingFox == null) error_message += ' 유저 테이블에 충전 실패';

        if (chargingFox == null) error_message += ' 지불 테이블에 쓰기 실패';

        return {
          statusCode: 401,
          message: '충전에 실패 하였습니다. error 내용 : ' + error_message,
        };
      }
    } catch (e) {
      console.log('setProduct catch error', e);
      return {
        statusCode: 401,
        message: '데이터 저장 실패.',
      };
    }
  }

  async getReservation(userUuid) {

    const data = await this.reservationRepository.find({
      userUuid : userUuid,
      method: In([reservationCode.WATING, reservationCode.COMPLETE, reservationCode.USED]),
    });

    let message = '';

    if ( data == null) 
    {
      message = '에약된 내역이 없습니다.'
    }
    else
    {
      message = '에약 조회 완료.'
    }

    return {
      statusCode: 201,
      message: message,
      data: data,
    };
  }

  async setReservation(data: ProductConfirmDto, user) {
    try {
    
      const reservation = await this.reservationRepository.save({
        product_main: data.product_main,
        product_house_viwing: data.product_house_viwing,
        product_vicle_viewing: data.product_vicle_viewing,
        product_airport_pickup: data.product_airport_pickup,
        product_utility_purchase: data.product_utility_purchase,
        product_licenses_create: data.product_licenses_create,
        product_other: data.product_other,

        date: data.year + data.month + data.day,
        year: data.year,
        month : data.month,
        day : data.day,
        startTime : data.startTime,
        endTime : data.endTime,
        userUuid : user.uuid,
        method : reservationCode.WATING

      });

      return {
        statusCode: 201,
        message: '입찰이 진행중입니다.',
      };
      //}
    } catch (e) {
      console.log('setReservation error', e);
      return {
        statusCode: 401,
        message: '예약에 실패 하였습니다.',
      };
    }
  }

  async checkReservation(data: ProductConfirmDto) {
    //커넥터의 일정을 조회해서 해당 날짜의 예약이 되어있는지 확인한다.
    const reservation_date = data.year + data.month + data.day;
    console.log(reservation_date);

    // const check_reservation = await this.reservationRepository.findOne({
    //   connect_user: data.connecter_uuid,
    //   date: reservation_date,
    // });

    // console.log(
    //   'check_reservation 현재 커넷터가 예약이 있는지 확인',
    //   check_reservation,
    // );

    // if (check_reservation != null) return false;
    // 예약 불가능
    //else 
    return true; // 예약가능

    // const nowTime = moment().format('HHmm');
    // //전시회 이후에 동작할 사항 리턴 넣도록 한다.
    // if (parseInt(data.time) < parseInt(nowTime)) {
    //   console.log('현재 시간 이전 예약이므로 리턴');
    //   return false;
    // }
    // const before = await this.getReservation(data.productsId, data.date);
    // //예약을 하려는 시간과 실제 예약된 해당 날짜에 해당하는 예약들 비교
    // console.log('--------------------------------------');
    // for (let i = 0; i < before.data.length; i++) {
    //   const from1 = parseInt(before.data[i]['time']);
    //   const to1 = parseInt(before.data[i]['time']);
    //   // const from2 = parseInt(data.time_min);
    //   // const to2 = parseInt(data.time_max);

    //   //[1420, 1530] , [2200, 2300]
    //   //from1 < to2 && to1 > from2
    //   //       from1,        to1,          from2,          to2
    //   //firstRange[0], firstRange[1], secondRange[0], secondRange[1])
    //   if (
    //     before.data[i]['method'] == '예약완료' ||
    //     before.data[i]['method'] == '이용중'
    //   ) {
    //     if (from1 < to1) {
    //       console.log('예약 시간이 겹칩니다 예약번호 = ', before.data[i]['id']);
    //       return false;
    //     }
    //   }
    // }
    // console.log('--------------------------------------');
    // return true;
  }

  async setAdvertise (data) {
    await this.advertiseRepository.save(data);
  }
  async getAllAdvertise() {
    const premium = await this.advertiseRepository.find(
      {
        business_type : businessType.PREMIUM
      }
    )

    const youtube = await this.advertiseRepository.find({
      advertise_type : advertiseType.YOUTUBE
    })

    const restaurnt = await this.advertiseRepository.find({
      advertise_type : advertiseType.RESTAURANT 
    })

    //프리미엄 광고

    const data = {
      premium : premium,
      youtube : youtube,
      restaurnt : restaurnt,
    }
    return data;
  }


  // async saveproductSlave(slave: productSlaveDto) {
  //   await this.slaveRepository.save({
  //     productsId: slave.productsId,
  //     slaveType: slave.slaveType,
  //     code: slave.code,
  //     name: slave.name,
  //     description: slave.description,
  //     onoff: slave.onoff,
  //     temperature: slave.temperature,
  //     airMode: slave.mode,
  //     airWindSpeed: slave.airWindSpeed,
  //     createdAt: moment().toDate(),
  //     updatedAt: moment().toDate(),
  //   });

  //   return {
  //     statusCode: 201,
  //     message: '데이터 저장 성공.',
  //   };
  // }

  // async updateSlaveStatus(data) {
  //   if (data.status == '' || data.status == null) return;
  //   if (data.status_checkDate == '' || data.status_checkDate == null) return;

  //   const checkDate = moment(data.status_checkDate).format(
  //     'YYYY-MM-DDTHH:mm:ss',
  //   );
  //   await this.slaveRepository.update(
  //     {
  //       slaveId: data.slaveId,
  //     },
  //     {
  //       status: data.status,
  //       status_checkDate: checkDate,
  //     },
  //   );

  //   return {
  //     statusCode: 201,
  //     message: '데이터 저장 성공.',
  //   };
  // }
  // async getproductId() {
  //   const data = await this.productRepository.find({
  //     select: ['id'],
  //   });

  //   return data;
  // }
  // async getproduct() {
  //   const data = await this.productRepository.find({
  //     select: [
  //       'id',
  //       'name',
  //       'price',
  //       'time_min',
  //       'time_max',
  //       'phone_company',
  //       'phone',
  //       'addr_detail',
  //       'addr',
  //       'description',
  //       'howused',
  //       'precautions',
  //       'precautions_used',
  //       'precautions_payment',
  //     ],
  //   });
  //   const url =
  //     process.env.NODE_ENV == 'development'
  //       ? process.env.BASE_URI_DEV
  //       : process.env.BASE_URI_LIVE;

  //   const data_all = [];
  //   //저장된 이미지 가져오기
  //   for (let i = 0; i < data.length; i++) {
  //     const dir = path.resolve(
  //       __dirname,
  //       '../../../public/images/product/' + data[i].id,
  //     );

  //     const files = fs.readdirSync(dir); // 디렉토리에 있는 파일 전부 가져오기
  //     const result = {
  //       //id', 'name', 'price', 'time_min', 'time_max', 'phone_company', 'phone','addr_detail','addr','description','howused','precautions','precautions_used','precautions_payment', 'privacy','service'
  //       id: 0,
  //       name: '',
  //       price: 0,
  //       time_min: '',
  //       time_max: '',
  //       //phone_company: '',
  //       //phone: '',
  //       addr_detail: '',
  //       addr: '',
  //       //description: '',
  //       //howused: '',
  //       //precautions: '',
  //       //precautions_used: '',
  //       //precautions_payment: '',
  //       images: [],
  //     };

  //     result.id = data[i].id;
  //     result.name = data[i].name;
  //     result.time_min = data[i].time_min;
  //     result.time_max = data[i].time_max;
  //     result.price = data[i].price;
  //     result.addr = data[i].addr;
  //     result.addr_detail = data[i].addr_detail;

  //     for (let j = 0; j < files.length; j++) {
  //       result.images.push(
  //         url + '/images/product/' + data[i].id + '/' + files[j],
  //       );
  //     }

  //     data_all.push(result);
  //   }

  //   if (data != null) {
  //     return {
  //       statusCode: 201,
  //       message: '데이터 조회성공.',
  //       data: data_all,
  //     };
  //   } else {
  //     return {
  //       statusCode: 401,
  //       message: '데이터 조회실패',
  //     };
  //   }
  // }
  // async geMyproduct(user: UserAccountModel) {
  //   //내예약 조회했을시 반납 시간이 지난 예약에 대해 반납처리 [[
  //   const today = moment().format('YYYYMMDD');

  //   const rejectData = await this.reservationRepository.find({
  //     where: {
  //       userUuid: user.uuid,
  //       //date: today,
  //     },
  //     order: { date: 'DESC' },
  //   });

  //   const nowTime = moment().format('HHmm');

  //   if (rejectData != null) {
  //     for (let i = 0; i < rejectData.length; i++) {
  //       //현재 날짜보다 낮은 날짜의 예약이 있으면 반납하도록 설정
  //       if (rejectData[i].date < today) {
  //         if (
  //           rejectData[i].method == '예약완료' ||
  //           rejectData[i].method == '이용중'
  //         ) {
  //           await this.setReservationReturn(rejectData[i].id);
  //         }
  //       } else if (rejectData[i].date == today) {
  //         //예약시간이 오늘이랑 같은데 시간이 작으면 반납 으로 설정
  //         if (rejectData[i].time_max <= nowTime) {
  //           //예약시간이 현재 시간보다 작으면 반납완료로 수정, 현재시간이랑 같으면 반납완료로 수정
  //           if (
  //             rejectData[i].method == '예약완료' ||
  //             rejectData[i].method == '이용중'
  //           ) {
  //             await this.setReservationReturn(rejectData[i].id);
  //           }
  //         }
  //       }
  //     }
  //   }
  //   //]]

  //   //내예약 가져오기 하였을시 현재 이용시간이면 이용중으로 현재상태 변경하기

  //   const used_data = await this.reservationRepository.find({
  //     where: { userUuid: user.uuid, date: today },
  //     order: { date: 'DESC' },
  //   });

  //   for (let i = 0; i < used_data.length; i++) {
  //     if (
  //       this.isInOperatingTime(used_data[i].time_min, used_data[i].time_max)
  //     ) {
  //       if (used_data[i].method == '예약완료') {
  //         console.log('현재 이용중인 시간입니다. = ', used_data[i].id);
  //         await this.setReservationUsed(used_data[i].id);
  //         used_data[i].method == '이용중';
  //       }
  //     }
  //   }

  //   const data = await this.reservationRepository.find({
  //     where: { userUuid: user.uuid },
  //     order: { date: 'DESC' },
  //     relations: ['products', 'products.slaves'],
  //   });

  //   if (data != null) {
  //     return {
  //       statusCode: 201,
  //       message: '데이터 조회성공.',
  //       data: data,
  //     };
  //   } else {
  //     return {
  //       statusCode: 401,
  //       message: '데이터 조회실패',
  //     };
  //   }
  // }
  // async geMyproductTest(user: UserAccountModel) {
  //   const data = await this.reservationRepository.find({
  //     where: { userUuid: user.uuid },
  //     order: { date: 'DESC' },
  //     relations: ['products', 'products.slaves'],
  //   });

  //   //내예약 조회했을시 반납 시간이 지난 예약에 대해 반납처리
  //   const today = moment().format('YYYYMMDD');

  //   const rejectData = await this.reservationRepository.find({
  //     where: {
  //       userUuid: '93222a4c-a779-4503-bfc0-9c6e846e788d',
  //       date: today,
  //     },
  //     order: { date: 'DESC' },
  //   });

  //   const nowTime = moment().format('HHMM');

  //   if (rejectData != null) {
  //     for (let i = 0; i < rejectData.length; i++) {
  //       if (rejectData[i].time_max < nowTime) {
  //         //예약시간이 현재 시간보다 작으면 반납완료로 수정
  //         if (rejectData[i].method == '예약완료') {
  //           await this.setReservationReturn(rejectData[i].id);
  //         }
  //       }
  //     }
  //   }

  //   //저장된 이미지 가져오기

  //   if (data != null) {
  //     return {
  //       statusCode: 201,
  //       message: '데이터 조회성공.',
  //       data: data,
  //     };
  //   } else {
  //     return {
  //       statusCode: 401,
  //       message: '데이터 조회실패',
  //     };
  //   }
  // }

  // async getReservationId(reservationId, date) {
  //   const data = await this.reservationRepository.findOne(
  //     {
  //       id: reservationId,
  //       date: date,
  //       method: In([
  //         reservationCode.COMPLETE,
  //         reservationCode.USED,
  //         reservationCode.RETURN,
  //       ]),
  //     },
  //     { relations: ['products'] },
  //   );

  //   return {
  //     statusCode: 201,
  //     message: '예약조회 완료.',
  //     data: data,
  //   };
  // }

  // async getReservationCancel(reservationsId, user) {
  //   const checkPayment = await this.paymentRepository.find({
  //     where: {
  //       reservationsId: reservationsId,
  //       userUuid: user.uuid,
  //     },
  //     relations: ['reservations'],
  //   });

  //   if (checkPayment == null) {
  //     return {
  //       statusCode: 401,
  //       message: '예약된 내역이 없습니다.',
  //     };
  //   } else {
  //     //현재 시간이 예약 맥스 시간보다 크면 예약 취소 되도록 설정
  //     const nowTime = moment().format('HHmm');
  //     const reservationMax = checkPayment[0].reservations.time_max;
  //     console.log(
  //       'nowTime = ',
  //       nowTime,
  //       'reservation TimeMax = ',
  //       reservationMax,
  //     );

  //     if (reservationMax <= nowTime) {
  //       return {
  //         statusCode: 401,
  //         message: '예약된 내역이 없습니다.',
  //       };
  //     }

  //     const refundPayment = await this.paymentRepository.update(
  //       {
  //         reservationsId: reservationsId,
  //       },
  //       {
  //         method: reservationCode.CANCEL,
  //         refund: true,
  //         refund_date: moment().toDate(),
  //       },
  //     );

  //     const reservationCancel = await this.reservationRepository.update(
  //       {
  //         id: reservationsId,
  //       },
  //       {
  //         method: reservationCode.CANCEL,
  //         system: false,
  //       },
  //     );

  //     return {
  //       statusCode: 201,
  //       message: '예약이 취소 되었습니다.',
  //     };
  //   }
  // }

  // //반납 후 iot 시설물 종료
  // async setReservationReturn(reservationsId) {
  //   const refundPayment = await this.paymentRepository.update(
  //     {
  //       reservationsId: reservationsId,
  //     },
  //     {
  //       method: reservationCode.RETURN,
  //       return: true,
  //       return_date: moment().toDate(),
  //     },
  //   );

  //   const reservationReturn = await this.reservationRepository.update(
  //     {
  //       id: reservationsId,
  //     },
  //     {
  //       method: reservationCode.RETURN,
  //       system: false,
  //     },
  //   );

  //   //iot 시설물 종료 기능 추가 필요

  //   return {
  //     statusCode: 201,
  //     message: '반납이 완료 되었습니다.',
  //   };
  // }

  // async setReservationUsed(reservationsId) {
  //   const reservationUsed = await this.reservationRepository.update(
  //     {
  //       id: reservationsId,
  //     },
  //     {
  //       method: reservationCode.USED,
  //     },
  //   );

  //   //iot 시설물 종료 기능 추가 필요

  //   return {
  //     statusCode: 201,
  //     message: '사용중입니다.',
  //   };
  // }
  // async getReservationCheck(reservationsId) {
  //   const reservationCheck = await this.reservationRepository.findOne({
  //     id: reservationsId,
  //     method: In([reservationCode.COMPLETE, reservationCode.USED]),
  //   });

  //   console.log('getReservationCheck = ');
  //   if (reservationCheck == null) {
  //     return {
  //       statusCode: 401,
  //       message: '예약시간이 아닙니다.',
  //       data: false,
  //     };
  //   }
  //   const check = this.isInOperatingTime(
  //     reservationCheck.time_min,
  //     reservationCheck.time_max,
  //   );

  //   if (check == true) {
  //     return {
  //       statusCode: 201,
  //       message: '예약시간 입니다.',
  //       data: check,
  //     };
  //   } else {
  //     return {
  //       statusCode: 401,
  //       message: '예약시간이 아닙니다.',
  //       data: check,
  //     };
  //   }
  // }
  // //운영시간 중복 체크
  // public isInReservationTime(beforeMin, beforeMax, now): boolean {
  //   let isIn = false;

  //   const startTime = moment(beforeMin, 'HHmm');
  //   const endTime = moment(beforeMax, 'HHmm');

  //   const nowTime = moment(now, 'HHmm');
  //   // console.log(' nowDate = ' , nowDate)
  //   //return agreementTime;
  //   if (startTime > endTime) {
  //     if (moment(nowTime).isSame(startTime)) {
  //       isIn = true;
  //       console.log('예약한 시간이 예약되어있는 시간과 같으면 중복예약', isIn);
  //     } else {
  //       isIn =
  //         moment(nowTime).isBetween(moment('0000', 'HHmm'), endTime) ||
  //         moment(nowTime).isBetween(startTime, moment('2400', 'HHmm'));
  //       console.log('시작 시간이 더클때 중복예약아님', isIn);
  //     }
  //   } else {
  //     console.log(
  //       'moment(nowTime) = ',
  //       moment(nowTime),
  //       'startTime = ',
  //       startTime,
  //     );

  //     if (moment(nowTime).isSame(startTime)) {
  //       isIn = true;
  //       console.log('예약한 시간이 예약되어있는 시간과 같으면 중복예약', isIn);
  //     } else {
  //       isIn = moment(nowTime).isBetween(startTime, endTime);
  //       console.log('일반적인 시간 중복예약아님 = ', isIn);
  //     }
  //   }
  //   console.log('예약 겹침 체크 확인 = ', isIn);
  //   return isIn;
  // }
  // //운영시간 체크
  // public isInOperatingTime(timeMin, timeMax): boolean {
  //   let isIn = false;

  //   const startTime = moment(timeMin, 'HHmm');
  //   const endTime = moment(timeMax, 'HHmm');

  //   // console.log('startTime = ', startTime);
  //   // console.log('endTime = ', endTime);
  //   const nowTime = moment();
  //   // console.log(' nowDate = ' , nowDate)
  //   //return agreementTime;
  //   if (startTime > endTime) {
  //     if (moment(nowTime).isSame(startTime)) {
  //       isIn = true;
  //       //console.log('예약한 시간이 현재 시간 과 동일하여 예약 가능', isIn);
  //     } else {
  //       isIn =
  //         moment(nowTime).isBetween(moment('0000', 'HHmm'), endTime) ||
  //         moment(nowTime).isBetween(startTime, moment('2400', 'HHmm'));
  //       //console.log('시작 시간 종료시간보다 클때 중간 시간 파악', isIn);
  //     }
  //   } else {
  //     if (moment(nowTime).isSame(startTime)) {
  //       isIn = true;
  //       //console.log('예약한 시간이 현재 시간 과 동일하여 예약 가능', isIn);
  //     } else {
  //       isIn = moment(nowTime).isBetween(startTime, endTime);
  //       //console.log('종료시간이 클때 중간시간 파악 = ', isIn);
  //     }
  //   }
  //   //console.log('예약 시간 확인 = ', isIn);
  //   return isIn;
  // }
  // async setReservationSystem(reservationId, systemOnOff) {
  //   await this.reservationRepository.update(
  //     {
  //       id: reservationId,
  //     },
  //     {
  //       system: systemOnOff,
  //     },
  //   );
  // }
  // async getSlaveCode(productsId, code) {
  //   return await this.slaveRepository.findOne({
  //     productsId: productsId,
  //     code: code,
  //   });
  // }

  // async checkEmergency(productsId) {
  //   //console.log('productsID', productsId);

  //   const emergency = await this.slaveRepository.findOne({
  //     productsId: productsId,
  //     code: 'SYSTEMCONTROL',
  //   });

  //   //console.log('emergency = ', emergency);
  //   const checkMinutes = moment
  //     .duration(moment().diff(emergency.status_checkDate))
  //     .asMinutes();

  //   //console.log(checkMinutes);
  //   //이멀전시 체크 하드웨어 상태값 10분 이상 상태이면 전체 비정상 처리
  //   if (checkMinutes <= 10) {
  //     await this.slaveRepository.update(
  //       {
  //         productsId: productsId,
  //       },
  //       {
  //         emergency: '정상',
  //       },
  //     );
  //     return true;
  //   } else {
  //     await this.slaveRepository.update(
  //       {
  //         productsId: productsId,
  //       },
  //       {
  //         //시연이후 변경해야함
  //         //emergency: '비정상',
  //         emergency: '정상',
  //       },
  //     );
  //     return true;
  //   }
  // }
  // async setControl(control: productSlaveControlDto) {
  //   // 제어 시스템 검증 알고리즘
  //   // 검증 1. 제어가 가능한 예약인지 우선 파악, 제어가 가능한 예약이 아니면 리턴 [[
  //   const today = moment().format('YYYYMMDD');
  //   const reservation = await this.getReservationId(
  //     control.reservationId,
  //     today,
  //   );

  //   //현재 제어 진행중에 예약페이지를 계속 켜놓았을때 제어 명령이 오게되면 예약시간 체크후 제어 명령 하도록 수정
  //   const reservationCheck = await this.getReservationCheck(
  //     control.reservationId,
  //   );

  //   if (reservationCheck.data == false) {
  //     //이용이 가능한 시간이 아닌데 이용중으로 되어있다면 반납이 되도록 수정
  //     if (reservation.data.method == '이용중') {
  //       await this.setReservationReturn(reservation.data.id);
  //     }

  //     return {
  //       statusCode: 401,
  //       message: '예약 시간이 아닙니다.',
  //       //data: control,
  //     };
  //   }
  //   //]]

  //   // 검증 2. 장비 상태가 비정상이면 장비가 꺼져있거나 status 전달이 문제가 생긴 부분이므로 리턴 [[
  //   const checkEmergency = await this.checkEmergency(control.productsId);

  //   const productPhone = reservation.data.products.phone;

  //   if (checkEmergency == false) {
  //     return {
  //       statusCode: 401,
  //       message:
  //         '제어 시스템에 문제가 있습니다. 관리자 (' +
  //         productPhone +
  //         ') 에게 문의 하세요.',
  //       //data: control,
  //     };
  //   }
  //   //]]

  //   // 검증 3. 예약시간과 장비상태가 완료되었을시 제어 명령을 업데이트 해준다 [[
  //   const slave = await this.slaveRepository.update(
  //     {
  //       productsId: control.productsId,
  //       code: control.code,
  //     },
  //     {
  //       onoff: control.onoff,
  //       temperature: control.temperature,
  //       mode: control.mode,
  //       airWindSpeed: control.airWindSpeed,
  //     },
  //   );
  //   //]]

  //   // 검증 4. 제어가 들어온 값이 시스템 컨트롤 부분이라면 예약시간 을 같이 보내서 운영 종료시간을 컨트롤러쪽에서 제어하도록한다 [[
  //   if (control.code == slaveCode.SYSTEMCONTROL) {
  //     //예약 번호를 가져와서 시스템이 켜질때 운영시간을 같이 보내서 사운드 켜짐이 되도록 전달한다.

  //     const systemControl = await this.getSlaveCode(
  //       control.productsId,
  //       slaveCode.SYSTEMCONTROL,
  //     );

  //     //예약 시스템에 system 컬럼 업데이트하기
  //     const systemOnOff = control.mode == '1' ? true : false;

  //     const reservation_system = await this.setReservationSystem(
  //       control.reservationId,
  //       systemOnOff,
  //     );

  //     try {
  //       const res = await axios({
  //         method: 'put',
  //         url: process.env.CONTROL_URL,
  //         data: {
  //           code: systemControl.code,
  //           time_min: reservation.data.time_min,
  //           time_max: reservation.data.time_max,
  //           slaveId: systemControl.slaveId,
  //           mode: control.mode,
  //         },
  //       });

  //       if (res.data != null)
  //         return {
  //           statusCode: 201,
  //           message: '제어성공',
  //           data: control,
  //         };
  //     } catch (e) {
  //       console.log('시스텝 설정 에러', e);
  //       return {
  //         statusCode: e.response.data.status,
  //         message: '제어 실패',
  //       };
  //     }
  //     //]]
  //     // 검증 5. 그외의 slave 제어시 기본 제어 코드 전달 하도록 한다 [[
  //   } else {
  //     //diot master 연동 하기
  //     if (control.code == slaveCode.LIGHT) {
  //       if (control.onoff == true) control.mode = '1';
  //       else control.mode = '0';
  //     }

  //     try {
  //       const res = await axios({
  //         method: 'put',
  //         url: process.env.CONTROL_URL,
  //         data: {
  //           code: control.code,
  //           slaveId: control.slaveId,
  //           power: control.onoff,
  //           mode: control.mode,
  //           temperature: control.temperature,
  //           fanSpeed: control.airWindSpeed,
  //         },
  //       });

  //       if (res.data != null)
  //         return {
  //           statusCode: 201,
  //           message: '제어성공',
  //           data: control,
  //         };
  //     } catch (e) {
  //       console.log('제어 에러', e);
  //       return {
  //         statusCode: e.response.data.status,
  //         message: e.response.data.error,
  //       };
  //     }
  //   }
  //   //]]
  // }

  // async setPush(data: productPushDto, userUuid) {
  //   for (let i = 0; i < data.data.length; i++) {
  //     const push = await this.pushRepository.save({
  //       pushId: data.data[i].pushId,
  //       sendTime: data.data[i].sendTime,
  //       msgTitle: data.data[i].msgTitle,
  //       msg: data.data[i].msg,
  //       isChecked: data.data[i].isChecked,
  //       userUuid: userUuid,
  //     });
  //   }
  // }
  // async setPushUpdate(userUuid) {
  //   const now = moment().format('YYYYMMDDHHmm').toString(); //20220808HHMM

  //   const isChecked = await this.pushRepository.count({
  //     userUuid: userUuid,
  //     isChecked: false,
  //   });
  //   console.log('isChecked = ', isChecked);

  //   if (isChecked == 0) {
  //     return {
  //       status: 201,
  //       message: '업데이트할 알림이 없습니다.',
  //     };
  //   }

  //   const push = await this.pushRepository.update(
  //     {
  //       userUuid: userUuid,
  //       sendTime: Raw((alias) => `${alias} < :now`, { now: now }),
  //       isChecked: false,
  //     },
  //     {
  //       isChecked: true,
  //     },
  //   );

  //   console.log('push update data =  ', push);

  //   return {
  //     status: 201,
  //     data: push,
  //   };
  // }

  // async setPushDelete(data: productPushDeleteDto, userUuid) {
  //   // const push = await this.pushRepository.delete({
  //   //   pushId: data.pushId,
  //   // });
  //   if (data.data == null || data.data.length == 0)
  //     return {
  //       status: 401,
  //       message: '푸시 아이디가 없습니다.',
  //     };

  //   const array = [];
  //   for (let i = 0; i < data.data.length; i++) {
  //     array.push(data.data[i]['pushId']);
  //   }

  //   //console.log('delete pushId = ', array);
  //   await getRepository(productPushModel)
  //     .createQueryBuilder()
  //     .delete()
  //     .where('pushId IN (:...pushId)', { pushId: array })
  //     .andWhere('userUuid = :userUuid', { userUuid: userUuid })
  //     .execute();

  //   return {
  //     status: 201,
  //     message: '삭제 되었습니다.',
  //   };
  // }

  // async getPush(userUuid) {
  //   const now = moment().format('YYYYMMDDHHmm').toString(); //20220808HHMM

  //   const push = await this.pushRepository.find({
  //     where: {
  //       userUuid: userUuid,
  //       sendTime: Raw((alias) => `${alias} <= :now`, { now: now }),
  //     },
  //     order: { sendTime: 'DESC' },
  //     take: 50,
  //   });
  //   // console.log('push data =  ', push);

  //   return {
  //     status: 201,
  //     data: push,
  //   };
  // }

  // async setNotice(data: productNoticeDto, type) {
  //   await this.noticeRepository.save({
  //     type: type,
  //     title: data.title,
  //     description: data.description,
  //     writer: data.writer,
  //     hits: 1,
  //   });

  //   return {
  //     status: 201,
  //     message: '등록 되었습니다.',
  //   };
  // }
  // async getNotice(type) {
  //   const data = await this.noticeRepository.find({
  //     type: type,
  //   });

  //   return {
  //     status: 201,
  //     message: '조회 완료.',
  //     data: data,
  //   };
  // }
  // async getNoticeDetail(type, id) {
  //   const data = await this.noticeRepository.findOne({
  //     type: type,
  //     id: id,
  //   });

  //   console.log('notice data= ', data);
  //   await this.noticeRepository.update(
  //     {
  //       id: id,
  //     },
  //     {
  //       hits: data.hits + 1,
  //     },
  //   );
  //   return {
  //     status: 201,
  //     message: '조회 완료.',
  //     data: data,
  //   };
  // }
  // async updateNotice(data: productUpdateNoticeDto) {
  //   await this.noticeRepository.update(
  //     {
  //       id: data.id,
  //     },
  //     {
  //       title: data.title,
  //       description: data.description,
  //     },
  //   );

  //   return {
  //     status: 201,
  //     message: '등록 되었습니다.',
  //   };
  // }

  // async setTerms(data: productTermsDto) {
  //   await this.termsRepository.save({
  //     privacy: data.privacy,
  //     service: data.service,
  //     location: data.location,
  //   });

  //   return {
  //     status: 201,
  //     message: '등록 되었습니다.',
  //   };
  // }
  // async updateTerms(data: productTermsDto) {
  //   await this.termsRepository.update(
  //     {
  //       id: 1,
  //     },
  //     {
  //       privacy: data.privacy,
  //       service: data.service,
  //       location: data.location,
  //       payment: data.payment,
  //     },
  //   );

  //   return {
  //     status: 201,
  //     message: '수정 되었습니다.',
  //   };
  // }
  // async getTerms() {
  //   const data = await this.termsRepository.find();
  //   return {
  //     status: 201,
  //     message: '조회 완료.',
  //     data: data,
  //   };
  // }

  // async returnAll(productsId) {
  //   const data = await this.reservationRepository.update(
  //     {
  //       productsId: productsId,
  //       method: In([reservationCode.COMPLETE, reservationCode.USED]),
  //     },
  //     {
  //       method: reservationCode.RETURN,
  //     },
  //   );

  //   return {
  //     statusCode: 201,
  //     message: '전체반납 완료.',
  //     data: data,
  //   };
  // }

  // async deleteReservation(uuid) {
  //   console.log('회원탈퇴시 예약한 내역들 전부 반납으로 변경');
  //   await this.reservationRepository.update(
  //     {
  //       userUuid: uuid,
  //     },
  //     {
  //       method: reservationCode.RETURN,
  //     },
  //   );
  // }
  // async asRequest(data: productASRequestDto, user) {
  //   try {
  //     const productsData = await this.getproductDetail(data.productsId);
  //     const product = productsData.data.products[0];

  //     // eslint-disable-next-line @typescript-eslint/no-var-requires
  //     const nodemailer = require('nodemailer');
  //     // eslint-disable-next-line @typescript-eslint/no-var-requires
  //     const smtpTransport = require('nodemailer-smtp-transport');

  //     const transporter = nodemailer.createTransport(
  //       smtpTransport({
  //         host: 'smtp.gmail.com',
  //         port: 465,
  //         secure: true,
  //         auth: {
  //           user: 'dev.spacetalk@gmail.com',
  //           pass: 'eutwoawdgltkwpsn',
  //         },
  //       }),
  //     );

  //     //제품명
  //     const subject = product.name + ' ' + data.type + '  요청 드립니다.';
  //     const description =
  //       '</p>' +
  //       subject +
  //       '</p>' +
  //       '부스 이름 : ' +
  //       product.name +
  //       '</p>' +
  //       '부스 위치 : ' +
  //       product.addr +
  //       '</p>' +
  //       '접수 내역 : ' +
  //       data.description +
  //       '</p>' +
  //       '접수자 : ' +
  //       user.nickName +
  //       '</p>' +
  //       '연락처 : ' +
  //       user.phone +
  //       '</p>';

  //     let imagesHtml = '';

  //     if (data.images[0] != '') {
  //       const imagesStart = '<img src="data:image/png;base64,';
  //       const imagesEnd = '"></p>';
  //       let image = '';
  //       for (let i = 0; i < data.images.length; i++) {
  //         image += imagesStart + data.images[i] + imagesEnd;
  //       }
  //       imagesHtml = '<html><body>' + description + image + '</body></html>';
  //     } else {
  //       imagesHtml = '<html><body>' + description + '</body></html>';
  //     }

  //     const mailOptions = {
  //       from: 'dev@spacetalk.co.kr',
  //       to: 'dev@spacetalk.co.kr',
  //       subject: subject,
  //       html: imagesHtml,
  //     };
  //     let result;

  //     transporter.sendMail(mailOptions, function (error, info) {
  //       if (error) {
  //         console.log(error);
  //         result = {
  //           statusCode: 401,
  //           message: error,
  //         };
  //       } else {
  //         console.log('Email sent: ' + info.response);
  //         result = {
  //           statusCode: 201,
  //           message: 'Email sent: ' + info.response,
  //         };
  //       }
  //     });
  //     console.log('result = ', result);
  //     return result;
  //   } catch (e) {
  //     console.log('메일보내기 오류 : ', e);
  //     return {
  //       statusCode: 401,
  //       message: 'error' + e,
  //     };
  //   }
  // }

  // async enquiryRequest(data: productEnquiryRequestDto) {
  //   try {
  //     // eslint-disable-next-line @typescript-eslint/no-var-requires
  //     const nodemailer = require('nodemailer');
  //     // eslint-disable-next-line @typescript-eslint/no-var-requires
  //     const smtpTransport = require('nodemailer-smtp-transport');

  //     const transporter = nodemailer.createTransport(
  //       smtpTransport({
  //         host: 'smtp.gmail.com',
  //         port: 465,
  //         secure: true,
  //         auth: {
  //           user: 'dev.spacetalk@gmail.com',
  //           pass: 'eutwoawdgltkwpsn',
  //         },
  //       }),
  //     );

  //     //제품명
  //     const subject = '[wemeet]  ' + data.subject + '  문의 드립니다.';
  //     const description =
  //       '</p>' +
  //       subject +
  //       '</p>' +
  //       '회사명: ' +
  //       data.company +
  //       '</p>' +
  //       '이름 : ' +
  //       data.name +
  //       '</p>' +
  //       '이메일 : ' +
  //       data.email +
  //       '</p>' +
  //       '연락처 : ' +
  //       data.phone +
  //       '</p>' +
  //       '내용 : ' +
  //       data.description +
  //       '</p>';

  //     const html = '<html><body>' + description + '</body></html>';

  //     const mailOptions = {
  //       from: 'dev@spacetalk.co.kr',
  //       to: 'master@spacetalk.co.kr',
  //       subject: subject,
  //       html: html,
  //     };
  //     let result;

  //     transporter.sendMail(mailOptions, function (error, info) {
  //       if (error) {
  //         console.log(error);
  //         result = {
  //           statusCode: 401,
  //           message: error,
  //         };
  //       } else {
  //         console.log('Email sent: ' + info.response);
  //         result = {
  //           statusCode: 201,
  //           message: 'Email sent: ' + info.response,
  //         };
  //       }
  //     });
  //     console.log('result = ', result);
  //     return result;
  //   } catch (e) {
  //     console.log('메일보내기 오류 : ', e);
  //     return {
  //       statusCode: 401,
  //       message: 'error' + e,
  //     };
  //   }
  // }
}
