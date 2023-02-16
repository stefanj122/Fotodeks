import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ImagesService } from 'src/images/images.service';
import { UsersService } from 'src/users/users.service';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Roles(Role.Admin)
@Controller('/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UsersService,
    private readonly imageService: ImagesService,
  ) {}

  @Get('/pending/users')
  @ApiBearerAuth()
  async noApprovedUsers() {
    return await this.userService.noApprovedUsers();
  }

  @Get('/pending/images')
  @ApiBearerAuth()
  async noApprovedImages() {
    return await this.imageService.noApprovedImages();
  }

  @Patch('/approve/user/:id')
  @ApiBearerAuth()
  async approveUser(
    @Query('approve') approve: boolean,
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return await this.adminService.approveUser(userId, approve);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        watermark: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('watermark'))
  @Post('/watermark')
  @ApiBearerAuth()
  async uploadWatermark(@UploadedFile() watermark: Express.Multer.File) {
    return await this.adminService.uploadWatermark(watermark);
  }
}
