import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { Comment } from 'src/entity/comment.entity';
import { User } from 'src/entity/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/createCommentDto.dto';

@ApiTags('admin-comments')
@Controller('/admin/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(
    @GetUser() user: User,
    @Body() comment: CreateCommentDto,
  ): Promise<Comment> {
    return await this.commentsService.createComment(comment, user);
  }
}
