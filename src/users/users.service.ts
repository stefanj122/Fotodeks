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

  async findOneByEmail(email: string): Promise<Users> {
    return await this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        displayName: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        role: true,
        isApproved: true,
      },
    });
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
}
