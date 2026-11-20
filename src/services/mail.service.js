const nodemailer = require("nodemailer");

let transporter;

function getMailConfig() {
  const user = process.env.MAIL_USER || process.env.SMTP_USER || process.env.EMAIL_USER;
  const password =
    process.env.MAIL_APP_PASSWORD ||
    process.env.SMTP_APP_PASSWORD ||
    process.env.EMAIL_APP_PASSWORD ||
    process.env.EMAIL_PASS;

  if (!user || !password) {
    throw new Error(
      "Email is not configured. Set MAIL_USER and MAIL_APP_PASSWORD in .env."
    );
  }

  return { user, password };
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const { user, password } = getMailConfig();
  const host = process.env.MAIL_HOST || process.env.SMTP_HOST;

  transporter = nodemailer.createTransport(
    host
      ? {
          host,
          port: Number(process.env.MAIL_PORT || process.env.SMTP_PORT || 587),
          secure: String(process.env.MAIL_SECURE).toLowerCase() === "true",
          auth: { user, pass: password },
        }
      : {
          service: process.env.MAIL_SERVICE || "gmail",
          auth: { user, pass: password },
        }
  );

  return transporter;
}

async function sendRegistrationEmail({ to, name }) {
  if (!to) {
    throw new Error("A recipient email address is required.");
  }

  const { user } = getMailConfig();
  const from = process.env.MAIL_FROM || `Banking App <${user}>`;

  return getTransporter().sendMail({
    from,
    to,
    subject: "Welcome to Banking App",
    text: `Hi ${name || "there"},\n\nYour Banking App account was registered successfully.\n\nYou can now sign in with ${to}.`,
    html: `<p>Hi ${name || "there"},</p><p>Your Banking App account was registered successfully.</p><p>You can now sign in with <strong>${to}</strong>.</p>`,
  });
}

module.exports = { sendRegistrationEmail };
