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
// import { productModel } from './product.model';
// import { productReservationModel } from './product_reservation.model';

@Entity('tbl_product_refund')
export class ProductRefundModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'productsId' })
  productsId: number;

  @Column('int', { name: 'reservationsId' })
  reservationsId: number;

  @Column('varchar', { name: 'method', length: 50, nullable: false })
  method: string;

  @Column('varchar', { name: 'userUuid', length: 50, nullable: false })
  userUuid: string;

  @Column('boolean', { name: 'payment', nullable: false })
  payment: boolean;

  @Column('datetime', { name: 'payment_date', nullable: true })
  payment_date: Date;

  @Column('boolean', { name: 'refund', nullable: false })
  refund: boolean;

  @Column('datetime', { name: 'refund_date', nullable: true })
  refund_date: Date;

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

  // @ManyToOne(() => productModel, (product) => product.payments)
  // @JoinColumn([{ name: 'productsId', referencedColumnName: 'id' }])
  // products: productModel;

  // @ManyToMany(() => UserAccountModel, (user) => user.payment)
  // @JoinColumn([{ name: 'userUuid', referencedColumnName: 'uuid' }])
  // user: UserAccountModel;
}
