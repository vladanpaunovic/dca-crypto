import { withSentry } from "@sentry/nextjs";
import axios from "axios";
import nodemailer from "nodemailer";

async function handler(req, res) {
  const { email, message, name, token } = req.body;

  const googleRecaptcha = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET}&response=${token}`
  );

  if (!googleRecaptcha.data.success) {
    return res.status(403).json({ message: "Please, provide a valid token" });
  }

  const transporter = nodemailer.createTransport({
    port: 587,
    host: "smtp-relay.sendinblue.com",
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASS,
    },
  });

  transporter.sendMail(
    {
      from: email,
      to: "dcacryptocurrency@gmail.com",
      replyTo: "dcacryptocurrency@gmail.com",
      subject: `Message From ${name}`,
      html: `<div>${message}</div>`,
    },
    function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    }
  );

  res.status(200).json({ status: "ok" });
}

export default withSentry(handler);
