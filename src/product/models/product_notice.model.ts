import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tbl_product_notice')
export class ProductNoticeModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  //notice : 공지사항, event : 이벤트 테이블
  @Column('varchar', { name: 'type', nullable: false })
  type: number | null;

  @Column('varchar', { name: 'title', nullable: true, length: 250 })
  title: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('varchar', { name: 'writer', nullable: true, length: 50 })
  writer: string | null;

  @Column('int', { name: 'hits', nullable: true })
  hits: number | null;
}
