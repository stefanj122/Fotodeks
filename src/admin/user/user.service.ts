import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

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
  async getListOfUsers(): Promise<{ count: number; data: User[] }> {
    const [data, count] = await this.userRepository.findAndCount();
    return { count, data };
  }

  async getSingleUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

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

    const newUser = await this.userRepository.save(user);

    if (newUser) {
      return { message: 'User is created succesfully.', data: newUser };
    }
    throw new BadRequestException('User not created!');
  }
  async updateUser(id: number, dto: UpdateUserDto) {
    if(dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10)
    } else {
      delete dto.password;
    }

    return await this.userRepository.update(id, dto);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (user && user.role !== 'admin') {
      await this.userRepository.delete(user);
    }
    throw new BadRequestException('User does not exist!');
  }
}
