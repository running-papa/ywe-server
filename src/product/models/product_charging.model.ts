import { UsersModel } from 'src/users/models/users.model';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductModel } from './product.model';
import { ProductPaymentModel } from './product_payment.model';

@Entity('tbl_product_charging')
export class ProductChargingModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;
  //충전한 유저
  @Column('varchar', { name: 'userUuid', length: 50, nullable: false })
  userUuid: string;
  //충전 프로덕드 아이디
  @Column('int', { name: 'productsId' })
  productsId: number;
  //충전금액
  @Column('boolean', { name: 'payment', nullable: true })
  payment: boolean;
  //충전날짜
  @Column('datetime', { name: 'payment_date', nullable: true })
  payment_date: Date;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updatedAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  //예약한 내역
  @ManyToOne(() => ProductModel, (product) => product.charging)
  @JoinColumn([{ name: 'productsId', referencedColumnName: 'id' }])
  products: ProductModel;

  // 1개의 충전당 1개의 지불건
  @OneToOne(() => ProductPaymentModel, (payment) => payment.charging)
  payments: ProductPaymentModel;
  //충전한 유저 정보
  @ManyToMany(() => UsersModel, (user) => user.charging)
  @JoinColumn([{ name: 'userUuid', referencedColumnName: 'uuid' }])
  user: UsersModel;
}
