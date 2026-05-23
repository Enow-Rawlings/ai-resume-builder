import Testimonial from '../models/Testimonial.js'

export const createTestimonial = async (req, res) => {
  try {
    const { name, handle, image, message } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Testimonial message is required.' })
    }

    const testimonial = await Testimonial.create({
      userId: req.userId,
      name: name || 'Anonymous',
      handle: handle || '@anonymous',
      image: image || '',
      message: message.trim(),
    })

    res.status(201).json({ testimonial, message: 'Testimonial submitted successfully.' })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    res.status(500).json({ message: 'Failed to save testimonial.' })
  }
}

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({})
      .sort({ createdAt: -1 })
      .limit(12)
      .lean()

    res.json({ testimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    res.status(500).json({ message: 'Failed to retrieve testimonials.' })
  }
}
