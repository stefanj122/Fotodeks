import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { User } from 'src/entity/user.entity';
import { Image } from 'src/entity/image.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createCommentDto.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
  ) {}

  async createComment(comment: CreateCommentDto, user: User): Promise<Comment> {
    const image = await this.imagesRepository.findOne({
      where: { id: comment.imageId, isApproved: true },
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return await this.commentsRepository.save({
      user,
      image,
      ...comment,
    });
  }
}
