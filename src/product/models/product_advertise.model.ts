import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_product_advertise')
export class ProductAdvertiseModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 45 })
  name: string;

  //일반, 골드, 플레티넘, 다이아
  @Column('varchar', { name: 'business_type', nullable: true, length: 45 })
  business_type: string;

  //부동산, 차량, 유튜브, 식당, 등등, 
  @Column('varchar', { name: 'advertise_type', nullable: true, length: 45 })
  advertise_type: string;

  @Column('varchar', { name: 'imageUrl', nullable: true, length: 1000 })
  thumbnailUrl: string | null;

  @Column('varchar', { name: 'advertiseUrl', nullable: true, length: 1000 })
  advertiseUrl: string | null;
}
