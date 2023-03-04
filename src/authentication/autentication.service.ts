import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/admin/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadType } from 'src/types/payload.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: UserDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('*')
      .where('user.email = :email', { email: createUserDto.email })
      .orWhere('user.displayName = :displayName', {
        displayName: createUserDto.displayName,
      })
      .getRawOne();
    if (user) {
      throw new BadRequestException('Email or display name is in use!');
    }
    const preparedUser = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };
    const newUser = await this.userRepository.save(preparedUser);
    if (newUser) {
      delete newUser.password;
      return {
        message: 'Successfully created',
        data: newUser,
        access_token: await this.login(newUser),
      };
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    return user && (await bcrypt.compare(pass, user.password)) ? user : null;
  }

  async login(user: JwtPayloadType) {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      role: user.role,
    };
    return {
      message: 'Successfully logged!',
      data: user,
      access_token: this.jwtService.sign(payload, {
        privateKey: process.env.JWT_SECRET,
        expiresIn:  process.env.JWT_EXPIRATION_TIME,
      }),
    };
  }
}
