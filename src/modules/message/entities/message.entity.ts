import { Chat } from 'src/modules/chat/entities/chat.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column()
  chat_id: number;

  @Column()
  user_id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  created_at: Date;

  @ManyToOne(() => Chat, (chat) => chat.messages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;
}
