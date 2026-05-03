const nodemailer = require("nodemailer");
const axios = require("axios");

const buildTransportOptions = ({ host, port, secure }) => ({
  host,
  port,
  secure,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    servername: host,
  },
});

const isYahooHost = (host = "") => /yahoo\.com$/i.test(host);

const mailSender = async (email, title, body) => {
  // Prefer Brevo HTTP API on cloud hosts where SMTP ports may be blocked.
  if (process.env.BREVO_API_KEY) {
    try {
      const fromEmail =
        process.env.MAIL_FROM_EMAIL || process.env.MAIL_USER || "no-reply@example.com";
      const fromName = process.env.MAIL_FROM_NAME || "StudyNotion";

      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { email: fromEmail, name: fromName },
          to: [{ email }],
          subject: title,
          htmlContent: body,
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
          },
          timeout: 20000,
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error while sending via Brevo API - ", email);
      console.log(error?.response?.data || error?.message || error);
      throw error;
    }
  }

  const host = process.env.MAIL_HOST;
  const primaryPort = Number(process.env.MAIL_PORT) || 465;
  const primarySecure = process.env.MAIL_SECURE === "true";

  const attempts = [
    { host, port: primaryPort, secure: primarySecure },
  ];

  // Yahoo can be flaky from cloud hosts; try both standard SMTP modes.
  if (isYahooHost(host)) {
    if (!(primaryPort === 465 && primarySecure === true)) {
      attempts.push({ host, port: 465, secure: true });
    }
    if (!(primaryPort === 587 && primarySecure === false)) {
      attempts.push({ host, port: 587, secure: false });
    }
  }

  let lastError;
  for (const attempt of attempts) {
    try {
      const transporter = nodemailer.createTransport(
        buildTransportOptions(attempt)
      );

      const info = await transporter.sendMail({
        from: `"StudyNotion by Praduman" <${process.env.MAIL_USER}>`,
        to: email,
        subject: title,
        html: body,
      });

      return info;
    } catch (error) {
      lastError = error;
      console.log(
        `Mail attempt failed: ${attempt.host}:${attempt.port} secure=${attempt.secure}`
      );
      console.log(error?.message || error);
    }
  }

  console.log("Error while sending mail (mailSender) - ", email);
  throw lastError;
};

module.exports = mailSender;
