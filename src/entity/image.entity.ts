import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Watermark } from './watermark.entity';

@Entity({ name: 'images' })
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (users) => users.images)
  user: Users;

  @OneToMany(() => Watermark, (watermark) => watermark.images)
  watermark: Watermark;

  @Column({ type: 'uuid' })
  name: string;

  @Column({ type: 'varchar' })
  tags: string;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;
}
