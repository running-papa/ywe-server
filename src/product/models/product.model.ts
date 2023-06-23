import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductChargingModel } from './product_charging.model';
import { ProductPaymentModel } from './product_payment.model';
import { ProductReservationModel } from './product_reservation.model';

@Entity('tbl_product')
export class ProductModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;
  @Column('varchar', { name: 'code', primary: true, length: 45 })
  code: string;
  //기능 MAIN, SERVICE,CHARGING
  @Column('varchar', { name: 'method', primary: true, length: 45 })
  method: string;
  //프로덕 이름
  @Column('varchar', { name: 'name', length: 10, nullable: false })
  name: string;
  //예약 가격 (1~10) 여우 / 여우 충전 비용
  @Column('int', { name: 'price', nullable: false })
  price: number;
  //이용시 주의사항
  @Column('text', { name: 'precautions_used', nullable: true })
  precautions_used: string | null;
  //취소및 환불규정
  @Column('text', {
    name: 'precautions_payment',
    nullable: true,
  })
  precautions_payment: string | null;

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

  // @OneToMany(
  //   () => ProductReservationModel,
  //   (reservation) => reservation.products,
  // )
  // reservations: ProductReservationModel[];

  @OneToMany(() => ProductChargingModel, (chargings) => chargings.products)
  charging: ProductChargingModel[];

  @OneToMany(() => ProductPaymentModel, (payment) => payment.products)
  payments: ProductPaymentModel[];
}
