import { Roles } from 'src/enums/role.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Images } from './image.entity';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Images, (images) => images.user)
  images: Images;

  @Column({ type: 'varchar', length: 20 })
  firstName: string;

  @Column({ type: 'varchar', length: 20 })
  lastName: string;

  @Column({ type: 'varchar', unique: true, length: 20 })
  displayName: string;

  @Column({ type: 'varchar', unique: true, length: 20 })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  password: string;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ type: 'enum', enum: Roles })
  role: Roles;
}
