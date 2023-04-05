import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from './image.entity';
import { User } from './user.entity';

@Entity({ name: 'notification' })
export class Notification {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column({ type: 'varchar', length: 100 })
  message: string;

  @Column({ type: 'varchar' })
  type: Image | Comment;

  @Column({ type: 'boolean', default: false })
  isSeen: boolean;

  @Column({ type: 'json' })
  meta: string;
}
