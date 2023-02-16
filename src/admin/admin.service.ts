import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import * as sharp from 'sharp';
import { Users } from 'src/entity/user.entity';
import { Watermark } from 'src/entity/watermark.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Watermark)
    private readonly watermarkRepository: Repository<Watermark>,
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

  async uploadWatermark(file: Express.Multer.File) {
    fs.renameSync(
      file.path,
      join(process.cwd(), '/photos/watermark/' + file.originalname),
    );
    const photo = await new Promise<Buffer>((resolve, rejects) => {
      fs.readFile(
        join(process.cwd(), '/photos/watermark/' + file.originalname),
        (err, data) => {
          err ? rejects(err) : resolve(data);
        },
      );
    });
    sharp(photo)
      .resize(285, 90)
      .png()
      .ensureAlpha(0)
      .toFile(
        join(process.cwd(), '/photos/watermark/285x90/' + file.originalname),
      );
    return await this.watermarkRepository.save({
      name: file.originalname,
      description: 'Watermark',
    });
  }
}
