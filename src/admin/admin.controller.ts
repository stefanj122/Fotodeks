import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/role.guard';
import { ImagesService } from 'src/images/images.service';
import { UsersService } from 'src/users/users.service';
import { AdminService } from './admin.service';

@ApiTags('admin')
@UseGuards(RolesGuard)
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
}
