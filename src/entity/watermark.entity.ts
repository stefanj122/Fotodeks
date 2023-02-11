import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Images } from './image.entity';

@Entity({ name: 'watermark' })
export class Watermark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Images, (images) => images.watermark)
  images: Images;
}
