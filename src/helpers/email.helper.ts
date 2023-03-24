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
  email: string[],
  displayName: string,
  imageId: number,
) => {
  const notification = {
    from: 'no-reply@fotodesk.app',
    to: email,
    subject: 'You have a new images to approve!',
    html: `<h1>User ${displayName} uploaded some goodies on our platform.</h1>
        <p>Please review them <a href="https://fotodesk.app/admin/images/pending-images/${imageId}">here</a></p>`,
  };

  transporter.sendMail(notification, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
