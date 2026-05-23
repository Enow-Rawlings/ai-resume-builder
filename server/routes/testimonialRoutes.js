import express from 'express'
import protect from '../middlewares/authMiddlewares.js'
import { createTestimonial, getTestimonials } from '../controllers/testimonialController.js'

const testimonialRouter = express.Router()

testimonialRouter.get('/', getTestimonials)
testimonialRouter.post('/', protect, createTestimonial)

export default testimonialRouter
