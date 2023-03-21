import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { Comment } from 'src/entity/comment.entity';
import { User } from 'src/entity/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-dto.dto';

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

  @Delete('/:id')
  @HttpCode(204)
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.commentsService.deleteComment(id, user);
  }

  @Put('/approval')
  async approvalComments(
    @Body() commentsData: { id: number; isApproved: boolean }[],
  ) {
    return this.commentsService.approvalComments(commentsData);
  }
}
