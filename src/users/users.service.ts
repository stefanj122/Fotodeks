import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findOneByAuth(email: string): Promise<any> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .select('*')
      .where('email = :username OR displayName = :username', {
        username: email,
      })
      .getRawOne();
  }

  async noApprovedUsers() {
    return await this.usersRepository.find({ where: { isApproved: false } });
  }

  async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByDisplayName(displayName: string) {
    return await this.usersRepository.findOneBy({ displayName });
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
}
