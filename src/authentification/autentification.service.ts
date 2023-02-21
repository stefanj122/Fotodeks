import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>
    ) { }
    
    async registerNewUser(user: UserDto) { 
       
        const users = await this.userRepository.findOne({ where: { email: user.email } });
        if (users) { 
            throw new BadRequestException('Email is in use!');
        }
        const usersName = await this.userRepository.findOne({ where: { displayName: user.displayName}});
        if (usersName) { 
            throw new BadRequestException('Display name is in use!');
        }
         const newPost = await this.userRepository.save(user);
            if (newPost) {
                return {
                message: "Successfully created",
                data: newPost
            };
            } else {
            throw new BadRequestException("Post not created");
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