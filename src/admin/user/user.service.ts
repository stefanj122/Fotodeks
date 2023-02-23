import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(input: string): Promise<User | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select('*')
      .where('user.email = :email', { email: input })
      .orWhere('user.displayName = :displayName', { displayName: input })
      .getRawOne();
  }
}
