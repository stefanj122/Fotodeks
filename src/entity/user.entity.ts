import { Role } from 'src/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Images } from './image.entity';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  firstName: string;

  @Column({ type: 'varchar', length: 20 })
  lastName: string;

  @Column({ type: 'varchar', unique: true, length: 20 })
  displayName: string;

  @Column({ type: 'varchar', unique: true, length: 40 })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ type: 'varchar', default: Role.User })
  role: Role;

  @OneToMany(() => Images, (images) => images.user)
  images: Images;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
