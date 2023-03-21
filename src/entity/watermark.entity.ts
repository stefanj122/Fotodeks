import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'watermark' })
export class Watermark {
  
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.watermarks)
  user: User;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;
}
