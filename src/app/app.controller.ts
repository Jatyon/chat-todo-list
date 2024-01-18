import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from '@app/app.service';
import { EmailService } from '@shared/send-mail'; //TODO: tu zmien dodaj modul caly
import { LocalAuthGuard } from '@modules/auth/guards/local-auth.guard';
import { AuthService } from '@modules/auth/auth.service';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}
}
