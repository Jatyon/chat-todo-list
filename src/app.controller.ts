import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './helpers/send-mail';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  async getHello() {}
}
