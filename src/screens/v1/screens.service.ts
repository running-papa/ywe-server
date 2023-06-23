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
    //user 예약상태 가져오기

    let reservation = null;
    if ( user.uuid != null)
    {
      reservation = await this.productService.getReservation(user.uuid);
    }





    const data = {
      status : 201,
      data : {
        user : {
          uuid : user.uuid,
          nickName : user.nickName,
          phone : user.phone,
        },
        premium_advertising : {
          
        },
        reservation : {
          message : reservation.message,
          data : reservation.data,
        },
        youtube : {
          
        },
        advertising : {

        }

      }
    }
    return
  }
  
}
