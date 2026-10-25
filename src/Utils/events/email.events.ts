import { EventEmitter } from "node:events";
import { Mail } from "nodemailer";
import { template } from "../email/verify.email.template";
import { sendEmail } from "./../email/send.email.js";

export const emaiEvents = new EventEmitter();

interface IEmail extends Mail.Options {
  otp: string;
  username: string;
}

emaiEvents.on("confirmEmail", async (data: IEmail) => {
  try {
    data.subject = "confrimEmail";
    data.html = template(data.otp, data.username, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send email", error);
  }
});

emaiEvents.on("forgetPassword", async (data: IEmail) => {
  try {
    data.subject = "Reset Password OTP";
    data.html = template(data.otp, data.username, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send reset password email", error);
  }
});
