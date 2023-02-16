import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity({ name: 'images' })
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  name: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  tags: string;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @ManyToOne(() => Users, (users) => users.images)
  user: Users;

  @CreateDateColumn()
  createdAt: Date;
}
