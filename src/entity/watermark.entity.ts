import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Images } from './image.entity';

@Entity({ name: 'watermark' })
export class Watermark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Images, (images) => images.watermark)
  images: Images;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text' })
  description: string;
}
