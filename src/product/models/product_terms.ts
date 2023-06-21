import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_product_terms')
export class ProductTermsModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  //개인정보수집동의
  @Column('text', {
    name: 'privacy',
    nullable: true,
  })
  privacy: string | null;
  //서비스이용약관
  @Column('text', {
    name: 'service',
    nullable: true,
  })
  service: string | null;

  //위치 정보동의
  @Column('text', {
    name: 'location',
    nullable: true,
  })
  location: string | null;

  //취소 환불 규정
  @Column('text', {
    name: 'payment',
    nullable: true,
  })
  payment: string | null;
}
