import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Images } from 'src/entity/image.entity';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
  ) {}

  async approveUser(userId: number, approve: boolean) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException("User doesn't exists");
    }
    if (approve) {
      user.isApproved = approve;
      return await this.usersRepository.save(user);
    }
    return await this.usersRepository.delete(user);
  }
}
