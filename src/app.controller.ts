import { Controller } from '@nestjs/common';
import { AuthService } from './authentification/autentification.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}
}
