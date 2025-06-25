import nodemailer from "nodemailer"
import config from "@/config"

const transporter = nodemailer.createTransport({
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

export const sendEmail = async ({ to, subject, text, from } : {
  to: string,
  subject: string,
  text: string,
  from?: string
}) => {
  try {
    const mailOptions = {
      from: from ?? config.email.from, 
      to, 
      subject,
      text, 
    }

    const info = await transporter.sendMail(mailOptions);
    
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error(`Email sending failed: ${(error as Error).message}`);
  }
};