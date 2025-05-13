const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
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
  }
};

module.exports = mailSender;
