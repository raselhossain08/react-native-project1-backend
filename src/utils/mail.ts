import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from 'nodemailer';

const sendVerification = async (email: string, link: string) => { 
      const mailOptions: SMTPTransport.Options = {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "rahatulwork@gmail.com",
          pass: "skvejhcbfqumfgxy",
        },
      };

      const transport = nodemailer.createTransport(mailOptions);

      await transport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        html: `<a href="${link}">Click here to verify your email</a>`,
      });
}
export const mail = {
  sendVerification,
};