import { UsersModel } from 'src/users/models/users.model';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductModel } from './product.model';
import { ProductChargingModel } from './product_charging.model';
import { ProductReservationModel } from './product_reservation.model';

//예약및 충전에 고객의 지불 내역 테이블
@Entity('tbl_product_payment')
export class ProductPaymentModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  //지불한 프로덕트 아이디 ( 예약, 충천 등등)
  @Column('int', { name: 'productsId' })
  productsId: number;
  //지불한 예약 번호
  @Column('int', { name: 'reservationsId', nullable: true })
  reservationsId: number;

  //지불한 예약 번호
  @Column('int', { name: 'chargingId', nullable: true })
  chargingId: number;

  @Column('varchar', { name: 'userUuid', length: 50, nullable: false })
  userUuid: string;

  @Column('boolean', { name: 'payment', nullable: true })
  payment: boolean;

  @Column('datetime', { name: 'payment_date', nullable: true })
  payment_date: Date;

  @Column('boolean', { name: 'refund', nullable: true })
  refund: boolean;

  @Column('datetime', { name: 'refund_date', nullable: true })
  refund_date: Date;

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

  @ManyToOne(() => ProductModel, (product) => product.payments)
  @JoinColumn([{ name: 'productsId', referencedColumnName: 'id' }])
  products: ProductModel;

  @OneToOne(() => ProductReservationModel,(reservation) => reservation.payments)
  @JoinColumn([{ name: 'reservationsId', referencedColumnName: 'id' }])
  reservation: ProductReservationModel;

  @OneToOne(() => ProductChargingModel, (charging) => charging.payments)
  @JoinColumn([{ name: 'chargingId', referencedColumnName: 'id' }])
  charging: ProductChargingModel;

  @ManyToMany(() => UsersModel, (user) => user.payment)
  @JoinColumn([{ name: 'userUuid', referencedColumnName: 'uuid' }])
  user: UsersModel;
}
