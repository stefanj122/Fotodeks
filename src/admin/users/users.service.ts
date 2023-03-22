import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/authentication/dto/registerUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(input: string | UserDto): Promise<User | undefined> {
    let searchParams: UserDto;
    if (typeof input === 'string') {
      searchParams = new UserDto();
      searchParams.email = input;
      searchParams.displayName = input;
    } else {
      searchParams = input;
    }
    return await this.usersRepository
      .createQueryBuilder('user')
      .select('*')
      .where('user.email = :email', { email: searchParams.email })
      .orWhere('user.displayName = :displayName', {
        displayName: searchParams.displayName,
      })
      .getRawOne();
  }
  async getListOfUsers(): Promise<{ count: number; data: User[] }> {
    const [data, count] = await this.usersRepository.findAndCount();
    return { count, data };
  }

  async getSingleUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found!');
    }
    return user;
  }

  async createUser(dto: CreateUserDto) {
    const user = {
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    };

    const newUser = await this.usersRepository.save(user);

    if (newUser) {
      return { message: 'User is created succesfully.', data: newUser };
    }
    throw new BadRequestException('User not created!');
  }
  async updateUser(id: number, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    } else {
      delete dto.password;
    }

    return await this.usersRepository.update(id, dto);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });

    if (user && user.role !== 'admin') {
      await this.usersRepository.remove(user);
    }
    throw new BadRequestException('User does not exist!');
  }
}
