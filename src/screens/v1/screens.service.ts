import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import { ProductService } from 'src/product/v1/product.service';
import { UsersService } from 'src/users/v1/users.service';
import { In, Repository } from 'typeorm';


@Injectable()
export class ScreensService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    
  ) {}

  async getHome(user) {

    //초기화
    let data = {
      status : 201,
      data : {
        user : {
          uuid : user.uuid,
          nickName : user.nickName,
          phone : user.phone,
        },
        premium_advertise : {
          data : []
        },
        reservation : {
          message : '',
          data : [],
          connecter : '',
        },
        youtube : {
          data : []
        },
        restaurnt : {
          data : []
        }

      }
    }

    //광고 가져오기
    let advertise = await this. productService.getAllAdvertise();
    data.data.premium_advertise.data = advertise.premium;
    data.data.youtube.data = advertise.youtube;
    data.data.restaurnt.data = advertise.restaurnt;
    //user 예약상태 가져오기

    let reservation = null;

    if ( user.uuid == null)
    {
      data.data.reservation.message = '꿈을 현실로, 캐나다 정착 서비스 \n 편안한 이주생활 여우이 정착서비스';
      data.data.reservation.data = [];
      console.log('여기로 들어옴1')
    }
    else
    {
      console.log('여기로 들어옴')
      reservation = await this.productService.getReservation(user.uuid);

      if ( reservation.data == null)
        data.data.reservation.message = '꿈을 현실로, 캐나다 정착 서비스 \n 편안한 이주생활 여우이 정착서비스';
      else
      {
        data.data.reservation.message = user.nickName + ' 예약 내역';
        data.data.reservation.connecter = reservation.data.connect_user;
      }
      data.data.reservation.data = reservation.data;
    }

    
    
    

    return data;
  }
  
}
