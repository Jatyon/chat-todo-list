import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AuthRefreshToken } from '@modules/auth/entities/auth-refresh-token.entity';
import { BoardUser } from '@modules/board-user/entities/board-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  is_active: boolean;

  @Column({ default: false })
  is_2fa: boolean;

  @Column({ nullable: true, default: null })
  twoFa_secret: string;

  @Column({ nullable: true })
  activate_token: string;

  @Column({ default: 0 })
  attemts_login: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  last_logged_at: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => null,
  })
  block_login_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updated_at: Date;

  @OneToMany(() => AuthRefreshToken, (token) => token.user_id)
  users: AuthRefreshToken[];

  @OneToMany(() => BoardUser, (boardUser) => boardUser.user)
  board_users: BoardUser[];
}
