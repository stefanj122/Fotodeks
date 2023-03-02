import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImagesService } from 'src/images/images.service';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly imagesService: ImagesService,
  ) {}
}
