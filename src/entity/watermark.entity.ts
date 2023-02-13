import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'watermark' })
export class Watermark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;
}
