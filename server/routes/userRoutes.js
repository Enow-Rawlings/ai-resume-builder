import express from 'express';
import { getUserById, loginUser, registerUser, getUserResumes, forgotPassword, resetPassword, googleAuth } from '../controllers/UserController.js';
import protect from '../middlewares/authMiddlewares.js';

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/google-auth', googleAuth)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/data', protect, getUserById)
userRouter.get('/resumes', protect, getUserResumes)

export default userRouter