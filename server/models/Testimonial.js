import mongoose from 'mongoose'

const TestimonialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  handle: { type: String, required: true },
  message: { type: String, required: true },
  image: { type: String, default: '' },
}, { timestamps: true })

const Testimonial = mongoose.model('Testimonial', TestimonialSchema)

export default Testimonial
