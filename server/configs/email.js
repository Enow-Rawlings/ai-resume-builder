import nodemailer from 'nodemailer'

const transportConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
}

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transportConfig.auth = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
}

const transporter = nodemailer.createTransport(transportConfig)

export const sendPasswordResetEmail = async ({ to, resetLink }) => {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@yourapp.com'
  const subject = 'Reset your password'
  const text = `You requested a password reset. Click or paste the link below to update your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this message.`
  const html = `
    <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
      <h2>Password reset request</h2>
      <p>You requested a password reset. Click the link below to update your password:</p>
      <p><a href="${resetLink}" style="display: inline-block; background: #9400D3; color: white; padding: 12px 18px; text-decoration: none; border-radius: 8px;">Reset password</a></p>
      <p>If the button does not work, paste this URL into your browser:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you did not request a reset, you can ignore this email.</p>
    </div>
  `

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP config missing. Password reset email not sent. Reset link:', resetLink)
    return
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  })
}
