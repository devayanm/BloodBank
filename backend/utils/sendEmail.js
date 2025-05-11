// utils/sendEmail.js

const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASS, // your Gmail app password
    },
  });

  await transporter.sendMail({
    from: `"Blood Bank" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html, // HTML version of the email
  });
};

module.exports = sendEmail;
