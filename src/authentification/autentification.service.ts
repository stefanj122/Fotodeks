import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/admin/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerNewUser(user: UserDto) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select('*')
      .where('user.email = :email', { email: user.email })
      .orWhere('user.displayName = :displayName', {
        displayName: user.displayName,
      })
      .getRawOne();
    if (users) {
      throw new BadRequestException('Email is in use!');
    }
    const preparedUser = {
      ...user,
      password: await bcrypt.hash(user.password, 10),
    };
    const newUser = await this.userRepository.save(preparedUser);
    if (newUser) {
      delete newUser.password;
      return {
        message: 'Successfully created',
        data: newUser,
      };
    } else {
      throw new BadRequestException('User not created');
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && user.isApproved === false) {
      const passOK = await bcrypt.compare(pass, user.password);
      if (passOK) {
        return user;
      }
    }
    return null;
  }
  async login(user: Users) {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        privateKey: jwtConstants.secret,
        expiresIn: '10h',
      }),
    };
  }
}
