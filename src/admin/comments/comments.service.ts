import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async createComment(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const image = await this.imagesRepository.findOne({
      where: { id: createCommentDto.imageId, isApproved: true },
    });
    const comment = await this.commentsRepository.findOne({
      where: { id: createCommentDto.commentId, isApproved: true },
      relations: ['user'],
    });
    if (!comment && createCommentDto.commentId) {
      throw new NotFoundException('Comment not found');
    }
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return await this.commentsRepository.save({
      user,
      image,
      parent: comment,
      ...createCommentDto,
    });
  }

  async deleteComment(id: number, user: User): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (user.role === 'admin' || user.id === comment.user.id) {
      this.commentsRepository.delete(id);
      return;
    }
    throw new BadRequestException('Comment cannot be deleted!');
  }
}
