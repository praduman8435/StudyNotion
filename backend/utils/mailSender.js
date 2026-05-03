const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 465,
      secure: process.env.MAIL_SECURE === "true",
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"StudyNotion by Praduman" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    // console.log('Info of sent mail - ', info);
    return info;
  } catch (error) {
    console.log("Error while sending mail (mailSender) - ", email);
    console.log(error);
    throw error;
  }
};

module.exports = mailSender;
