import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/entity/user.entity';
import { jwtConstants } from './constant';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }
  async login(user: Users) {
    const payload = {
      displayName: user.displayName,
      id: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        privateKey: jwtConstants.secret,
        expiresIn: '1h',
      }),
    };
  }
}
