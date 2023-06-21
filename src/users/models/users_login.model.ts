import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users_login')
export class UsersLoginModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', length: 45 })
  email: string;

  @Column('datetime', { name: 'loginAt', default: () => 'CURRENT_TIMESTAMP' })
  loginAt: Date;
}
