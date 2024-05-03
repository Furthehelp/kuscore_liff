"use server";
import nodemailer from "nodemailer";

export async function sendEmail(email, token) {
  const transporter = nodemailer.createTransport({
    host: "fedteams.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const confirmationUrl = `${process.env.NEXT_PUBLIC_URL}/verify?=${token}`;
  const mailOptions = {
    from: '"Verification Email" noreply@fedteams.com',
    to: email,
    subject: "Link your account",
    html: `
        <p>Hello,</p>
        <p>Click the following link to confirm your account:</p>
        <a href="${confirmationUrl}">Confirm Account</a>
      `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending confirmation email:", error);
    } else {
      console.log("Confirmation email sent:", info.response);
    }
  });

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email Sent!");
  } catch (error) {
    console.error(error);
    return error;
  }
}
