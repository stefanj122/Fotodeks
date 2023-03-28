import { BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_NAME,
    pass: process.env.USER_PASSWORD,
  },
});

export const sendImageEmailNotification = (
  emails: string[],
  displayName: string,
  imageId: number,
) => {
  const notification = {
    from: process.env.APP_NO_REPLY_EMAIL,
    to: emails,
    subject: 'You have a new images to approve!',
    html: `<h1>User ${displayName} uploaded some goodies on our platform.</h1>
        <p>Please review them <a href=""process.env.BASE_URL" + "/admin/images/pending-images/${imageId}"">here</a></p>`,          
  };

  transporter.sendMail(notification, function (err) {
    if (err) {
      throw new BadRequestException('Sending notification failed');       
    }
  });
};


