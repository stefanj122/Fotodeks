import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDtio.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);
    return await this.usersRepository.save({
      ...createUserDto,
      password: hash,
    });
  }

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
}
