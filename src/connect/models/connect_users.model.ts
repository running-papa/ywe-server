import { ProductChargingModel } from 'src/product/models/product_charging.model';
import { ProductPaymentModel } from 'src/product/models/product_payment.model';
import { ProductReservationModel } from 'src/product/models/product_reservation.model';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('connect_users')
export class ConnectUsersModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Generated('uuid')
  @Column('varchar', {
    name: 'uuid',
    unique: true,
    length: 50,
  })
  uuid: string;

  @Column('varchar', { name: 'provider', length: 20, nullable: true })
  provider: string | null;

  @Column('varchar', { name: 'nickname', length: 20, nullable: true })
  nickName: string | null;

  @Column('varchar', { name: 'email', nullable: true, length: 45 })
  email: string | null;

  @Column('varchar', { name: 'email_verified_at', nullable: true, length: 45 })
  email_verified_at: string | null;

  @Column('varchar', { name: 'password', length: 200 })
  password: string;

  @Column('int', { name: 'fox', default: 0 })
  fox: string;

  //refresh token 저장
  @Column({ name: 'refreshToken', length: 100, nullable: true })
  refreshToken?: string;

  @Column('varchar', { name: 'phone', length: 45 })
  phone: string;

  @Column('int', { name: 'drop', nullable: true })
  drop: number | null;

  @Column('int', { name: 'user_level', default: 5 })
  user_level: string;

  @Column('varchar', { name: 'avatar', nullable: true, length: 200 })
  avatar: string | null;

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

  @ManyToMany(() => ProductReservationModel, (reservation) => reservation.user)
  reservation: ProductReservationModel[];

  @ManyToMany(() => ProductPaymentModel, (payment) => payment.user)
  payment: ProductPaymentModel[];

  @ManyToMany(() => ProductChargingModel, (charging) => charging.user)
  charging: ProductChargingModel[];
}
