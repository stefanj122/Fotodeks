import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { paginate } from 'src/helpers/paginate.helper';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/authentication/dto/registerUser.dto';
import { getUsername } from 'src/helpers/getUsername.helper';
import { Meta } from 'src/types/meta.type';
import { sortByHelper } from 'src/helpers/sort-by.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(input: string | UserDto): Promise<User | undefined> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select('*')
      .where('user.email = :email', { email: getUsername(input, 'email') })
      .orWhere('user.displayName = :displayName', {
        displayName: getUsername(input, 'displayName'),
      })
      .getRawOne();
  }
  async getListOfUsers(
    page: number,
    perPage: number,
    sortBy: string,
  ): Promise<{ users: User[]; meta: Meta }> {
    const pagination = paginate(page, perPage);
    const userColumns = this.usersRepository.metadata.columns.map(
      (column) => column.propertyName,
    );
    const [column, order] = sortByHelper(sortBy, userColumns);

    const [data, count] = await this.usersRepository
      .createQueryBuilder('users')
      .orderBy(`users.${column}`, `${order}`)
      .offset(pagination.offset)
      .limit(pagination.limit)
      .getManyAndCount();

    return {
      users: data,
      meta: {
        count,
        currentPage: pagination.currentPage,
        perPage: pagination.limit,
        sortBy: [column, order],
      },
    };
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
      return { message: 'User is created successfully.', data: newUser };
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
