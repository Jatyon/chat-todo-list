import { Board } from 'src/modules/board/entities/board.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  board_id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  created_at: Date;

  @OneToOne(() => Board, (board) => board.chat)
  board: Board;

  @OneToMany(() => Message, (message) => message.chat_id)
  messages: Message[];
}
