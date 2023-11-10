import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      secure: false, // false for TLS
      auth: {
        user: 'mailnastronezgrami@gmail.com',
        pass: 'amnv awrv wixm ffnj',
      },
    });
  }

  async sendActivationEmail(to: string, activationToken: string) {
    try {
      const activationLink: string = `http://localhost:3000/api/user/active-account/${activationToken}`;

      const mailOptions: { from: string; to: string; subject: string; text: string } = {
        from: 'mailnastronezgrami@gmail.com',
        to,
        subject: 'Aktywacja konta',
        text: `Kliknij ten link, aby aktywować konto: ${activationLink}`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Błąd podczas wysyłania e-maila');
    }
  }

  async sendForgotPasswordEmail(to: string, activationToken: string) {
    try {
      const activationLink: string = `http://localhost:3000/api/user/forgot-password/${activationToken}`;

      const mailOptions: { from: string; to: string; subject: string; text: string } = {
        from: 'mailnastronezgrami@gmail.com',
        to,
        subject: 'przypomnij hasło',
        text: `Kliknij ten link, aby utworzyć nowe hasło: ${activationLink}`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Błąd podczas wysyłania e-maila');
    }
  }
}
