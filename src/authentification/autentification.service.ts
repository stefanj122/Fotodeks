import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>
    ) { }
    
    async registerNewUser(user: UserDto) { 
       
        const users = await this.userRepository
            .createQueryBuilder('user').select('*').where('user.email = :email', { email: user.email })
            .orWhere('user.displayName = :displayName', { displayName: user.displayName })
            .getRawOne();
        if (users) { 
            throw new BadRequestException('Email is in use!');
        }
        const preparedUser = {
            ...user,
            password: await bcrypt.hash(user.password, 10)
        }
         const newUser = await this.userRepository.save(preparedUser);
            if (newUser) {
                delete newUser.password;
                return {
                    message: "Successfully created",
                    data: newUser
            };
            } else {
            throw new BadRequestException("User not created");
            }
    }
}

//   async validateUser(username: string, pass: string): Promise<any> {
//     const user = await this.usersService.findOne(username);
//     if (user && user.password === pass) {
//       const { password, ...result } = user;
//       return result;
//     }
//     return null;
//     }
    
//     async login(user: any) {
//         const payload = { username: user.username, sub: user.userId };
//         return {
//           access_token: this.jwtService.sign(payload),
//         };
//     }
    
// }