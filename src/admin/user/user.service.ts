import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async findOne(email: string): Promise<Users | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select('*')
      .where('user.email = :email', { email: email })
      .orWhere('user.displayName = :displayName', { displayName: email })
      .getRawOne();
  }
}
