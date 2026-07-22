import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP Email configuration missing. Please set SMTP_USER and SMTP_PASS in Vercel settings.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  const from = process.env.SMTP_FROM || `"Swagatam Cafe" <${user}>`;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  return info;
}
