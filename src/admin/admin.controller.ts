import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/approve/users')
  async noApprovedUsers() {
    return await this.adminService.noApprovedUsers();
  }
}
