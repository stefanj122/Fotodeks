import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/createUserDtio.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HomeService {
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
}
