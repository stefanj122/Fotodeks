import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/authentication/dto/registerUser.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './update-user.dto';

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

  async createUser(user: UserDto) {
    const newUser = await this.userRepository.save(user);

    if (newUser) {
      return { message: 'User is created succesfully.', data: newUser };
    }
    throw new BadRequestException('User not created!');
  }
  async updateUser(id: number, dto: UpdateUserDto) {
    return await this.userRepository.update(id, dto);
  }

  async deleteUser(id: number): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });

    if (user && user.role !== 'admin') {
      return await this.userRepository.delete(user);
    }
    throw new BadRequestException('User does not exist!');
  }
}
