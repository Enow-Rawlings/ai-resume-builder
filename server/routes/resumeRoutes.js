// import express from 'express'
// import protect from '../middlewares/authMiddlewares.js'
// import upload from '../configs/multer.js'
// import { createResume, deleteResume, getResumeById, getPublicResumeById, updateResume } from '../controllers/resumeController.js'


// const resumeRouter = express.Router()

// resumeRouter.post('/create', protect, createResume)
// resumeRouter.get('/get/:resumeId', protect, getResumeById)
// resumeRouter.put('/update', protect, updateResume)
// resumeRouter.put('/upload', upload.single('image'), protect, updateResume)
// resumeRouter.delete('/delete/:resumeId', protect, deleteResume)
// resumeRouter.get('/public/:resumeId', protect, getPublicResumeById)

// export default resumeRouter


// import express from 'express'
// import protect from '../middlewares/authMiddlewares.js'
// import upload from '../configs/multer.js'
// import { createResume, deleteResume, getResumeById, getPublicResumeById, updateResume } from '../controllers/resumeController.js'

// const resumeRouter = express.Router()

// resumeRouter.post('/create', protect, createResume)
// resumeRouter.get('/get/:resumeId', protect, getResumeById)

// // ✅ FIXED: Add upload.single('image') directly to your standard update route
// resumeRouter.put('/update', upload.single('image'), protect, updateResume)

// resumeRouter.delete('/delete/:resumeId', protect, deleteResume)
// resumeRouter.get('/public/:resumeId', protect, getPublicResumeById)

// export default resumeRouter

// import express from 'express'
// import protect from '../middlewares/authMiddlewares.js'
// import upload from '../configs/multer.js'
// import { createResume, deleteResume, getResumeById, getPublicResumeById, updateResume } from '../controllers/resumeController.js'

// const resumeRouter = express.Router()

// resumeRouter.post('/create', protect, createResume)
// resumeRouter.get('/get/:resumeId', protect, getResumeById)

// // ✅ FIXED: Only ONE update route allowed. Multer must run BEFORE protect.
// resumeRouter.put('/update', upload.single('image'), protect, updateResume)

// resumeRouter.delete('/delete/:resumeId', protect, deleteResume)
// resumeRouter.get('/public/:resumeId', protect, getPublicResumeById)

// export default resumeRouter


import express from 'express'
import protect from '../middlewares/authMiddlewares.js'
import upload from '../configs/multer.js'
import { createResume, deleteResume, getResumeById, getPublicResumeById, updateResume } from '../controllers/resumeController.js'

const resumeRouter = express.Router()

resumeRouter.post('/create', protect, createResume)
resumeRouter.get('/get/:resumeId', protect, getResumeById)

// ✅ Accept optional image upload and background removal for profile image updates
resumeRouter.put('/update', upload.single('image'), protect, updateResume)

resumeRouter.delete('/delete/:resumeId', protect, deleteResume)
// Public resume view should not require authentication
resumeRouter.get('/public/:resumeId', getPublicResumeById)

export default resumeRouter
