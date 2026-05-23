import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env'), override: true })

import connectDB from './configs/db.js';
// import { useReducer } from 'react';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import testimonialRouter from './routes/testimonialRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Database Conncection
await connectDB()

app.use(express.json())
app.use(cors())

app.get('/', (req, res)=> res.send("server is live..."))
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)
app.use('/api/testimonials', testimonialRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
})