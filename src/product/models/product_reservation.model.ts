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

  @Column('int', { name: 'productsId' })
  productsId: number;

  @Column('varchar', { name: 'date', nullable: false })
  date: string;

  //일별 예약으로 변경
  @Column('varchar', { name: 'year', length: 4, nullable: false })
  year: string;

  //일별 예약으로 변경
  @Column('varchar', { name: 'momth', length: 2, nullable: false })
  momth: string;

  //일별 예약으로 변경
  @Column('varchar', { name: 'day', length: 2, nullable: false })
  day: string;

  @Column('varchar', { name: 'userUuid', length: 50, nullable: false })
  userUuid: string;

  @Column('varchar', { name: 'method', length: 50, nullable: false })
  method: string;

  //취소및 환불규정
  @Column('text', {
    name: 'description',
    nullable: true,
  })
  description: string | null;

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
  @Column('varchar', { name: 'connect_user', length: 50, nullable: false })
  connect_user: string;

  //예약한 내역
  @ManyToOne(() => ProductModel, (product) => product.reservations)
  @JoinColumn([{ name: 'productsId', referencedColumnName: 'id' }])
  products: ProductModel;

  // //예약 1건당 1개의 지불건
  @OneToOne(() => ProductPaymentModel, (payment) => payment.reservations)
  payments: ProductPaymentModel;
  // //예약한 유저 정보
  @ManyToMany(() => UsersModel, (user) => user.reservation)
  @JoinColumn([{ name: 'userUuid', referencedColumnName: 'uuid' }])
  user: UsersModel;
}
