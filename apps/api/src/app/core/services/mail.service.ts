import * as nodemailer from 'nodemailer';
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { environment } from "../../../environments/environment";

const transporter = nodemailer.createTransport({
  host: environment.mail.host,
  port: environment.mail.port,
  secure: environment.mail.secure,
  auth: {
    user: environment.mail.auth.user,
    pass: environment.mail.auth.pass
  }
}, {
  from: environment.mail.from
});

export default async function sendMail(message: Mail.Options): Promise<SMTPTransport.SentMessageInfo | void> {
  return await transporter.sendMail(message).catch(console.error);
}
