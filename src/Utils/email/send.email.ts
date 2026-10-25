import { createTransport, Mail } from "nodemailer";
import { BadRequestException } from "./../response/error.response";
import { env } from "../../config/config.service.js";

export const sendEmail = async (data: Mail.Options): Promise<void> => {
  if (!data.html && !data.attachments && !data.text) {
    throw new BadRequestException("Missing Email Content");
  }
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USERNAME,
      pass: env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    ...data,
    from: `"Route Academy"<${env.EMAIL_USERNAME}>`,
  });
};
