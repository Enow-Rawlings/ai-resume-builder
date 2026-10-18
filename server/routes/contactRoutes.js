import express from 'express'
import { sendContactEmail } from '../configs/email.js'

const contactRouter = express.Router()

// POST /api/contact
contactRouter.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' })
    }

    await sendContactEmail({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() })

    return res.status(200).json({ message: 'Message sent! We\'ll get back to you within one business day.' })
  } catch (error) {
    console.error('Contact email error:', error)
    return res.status(500).json({ message: 'Failed to send message. Please try again.' })
  }
})

export default contactRouter
