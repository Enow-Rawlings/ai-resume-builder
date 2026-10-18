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

export const sendContactEmail = async ({ name, email, subject, message }) => {
  const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@cvpilot.app'

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP config missing. Contact email not sent.')
    return
  }

  if (!to) {
    console.warn('No CONTACT_EMAIL or SMTP_USER set. Contact email not sent.')
    return
  }

  await transporter.sendMail({
    from,
    to,
    replyTo: `${name} <${email}>`,
    subject: `[CVPILOT Contact] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
        <h2 style="color: #9400D3;">New Contact Form Submission</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 80px;">Name</td><td>${name}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Subject</td><td>${subject}</td></tr>
        </table>
        <hr style="margin: 16px 0; border-color: #e2e8f0;" />
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `,
  })
}
