import { Controller } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('/users')
export class ImagesController {
  constructor(private readonly userService: ImagesService) {}
}
