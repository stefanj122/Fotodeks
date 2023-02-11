import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/role.guard';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(RolesGuard)
  @Get('/pending/users')
  async noApprovedUsers() {
    return await this.adminService.noApprovedUsers();
  }
}
