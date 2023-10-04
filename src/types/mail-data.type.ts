import { MailerService } from '@nestjs-modules/mailer';

export type MailDataT = {
  email: string[];
  subject: string;
  template: string;
  context: ContextT[];
  mailerService: MailerService;
};

export type ContextT = {
    displayName?: string;
    imageId?: number;
    link?: string;

};
