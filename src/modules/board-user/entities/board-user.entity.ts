import { Board } from 'src/modules/board/entities/board.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class BoardUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  board_id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.board_users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Board, (board) => board.board_users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'board_id' })
  board: Board;
}
