import { UsersModel } from 'src/users/models/users.model';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductModel } from './product.model';
import { ProductPaymentModel } from './product_payment.model';

@Entity('tbl_product_reservation')
export class ProductReservationModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'product_main', nullable: false })
  product_main: string;

  @Column('boolean', { name: 'product_house_viewing', nullable: false, default: false})
  product_house_viwing: boolean;

  @Column('boolean', { name: 'product_vicle_viewing', nullable: false, default: false})
  product_vicle_viewing: boolean;

  @Column('boolean', { name: 'product_airport_pickup', nullable: false, default: false})
  product_airport_pickup: boolean;

  @Column('boolean', { name: 'product_utility_purchase', nullable: false, default: false})
  product_utility_purchase: boolean;

  @Column('boolean', { name: 'product_licenses_create', nullable: false, default: false})
  product_licenses_create: boolean;

  @Column('text', { name: 'product_other', nullable: true})
  product_other: string;

  @Column('varchar', { name: 'date', nullable: false })
  date: string;

  //일별 예약으로 변경
  @Column('varchar', { name: 'year', length: 4, nullable: false })
  year: string;

  //일별 예약으로 변경
  @Column('varchar', { name: 'month', length: 2, nullable: false })
  month: string;

  //일별 예약으로 변경
  @Column('varchar', { name: 'day', length: 2, nullable: false })
  day: string;

  @Column('varchar', { name: 'startTime', length: 2, nullable: false })
  startTime: string;

  @Column('varchar', { name: 'endTime', length: 2, nullable: false })
  endTime: string;

  @Column('varchar', { name: 'userUuid', length: 50, nullable: false })
  userUuid: string;

  @Column('varchar', { name: 'method', length: 50, nullable: false })
  method: string;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updatedAt',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date;

  //커넥션을 지원하는 유저
  @Column('varchar', { name: 'connecterUuid', length: 50, nullable: true })
  connecterUuid: string;

  //예약한 내역
  // @ManyToOne(() => ProductModel, (product) => product.reservations)
  // @JoinColumn([{ name: 'productsId', referencedColumnName: 'id' }])
  // products: ProductModel;

  // //예약 1건당 1개의 지불건
  @OneToOne(() => ProductPaymentModel, (payment) => payment.reservation)
  payments: ProductPaymentModel;
  // //예약한 유저 정보
  @ManyToMany(() => UsersModel, (user) => user.reservation)
  @JoinColumn([{ name: 'userUuid', referencedColumnName: 'uuid' }])
  user: UsersModel;
}
