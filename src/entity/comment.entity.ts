import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from './image.entity';
import { User } from './user.entity';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Image, (image) => image.comments, { onDelete: 'CASCADE' })
  image: Image;

  @Column()
  content: string;

  @Column()
  rate: number;

  @Column()
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
