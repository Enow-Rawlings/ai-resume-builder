import express from 'express';
import { getUserById, loginUser, registerUser, getUserResumes } from '../controllers/UserController.js';
import protect from '../middlewares/authMiddlewares.js';



const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserById)
userRouter.get('/resumes', protect, getUserResumes)

export default userRouter