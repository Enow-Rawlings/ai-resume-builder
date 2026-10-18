import User from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import Resume from '../models/Resume.js';
import { sendPasswordResetEmail } from '../configs/email.js';

const generateToken = (userId) =>{
    const token =jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token
}

const generatePasswordResetToken = () => {
    return crypto.randomBytes(32).toString('hex')
}



//POST: /api/iusers/register
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body
    
        //check if required fields are present
        if(!name || !email || !password){
            return res.status(400).json({message: 'Missing required fields'})
        }

        //check if user already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'User already exists'})
        }

        // create new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        //return success message
        const token = generateToken(newUser._id)
        newUser.password = undefined;

        return res.status(201).json({message: 'User created successfully', token, user: newUser})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }

}

// controller for user login

//POST: /api/users/login

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({message: 'Email and password are required'})
        }

        //check if user already exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        //check if password is correct
        if (!user.comparePassword(password)) {
            return res.status(400).json({message: 'Invalid email or password'})           
         }

        
         //return success message
         const token = generateToken(user._id)
         user.password = undefined

         return res.status(200).json({message: 
            'Login successfully', token, user
         })
    } catch (error) {
        return res.status(400).json({message: error.message})
    }

}

//controller for handling forgot password requests
//POST: /api/users/forgot-password

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: 'Email is required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(200).json({ message: 'If that email is registered, password reset instructions will be sent.' })
        }

        const resetToken = generatePasswordResetToken()
        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000 // 1 hour
        await user.save()

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
        const resetLink = `${clientUrl}/reset-password/${resetToken}`

        await sendPasswordResetEmail({
          to: email,
          resetLink,
        })

        return res.status(200).json({
            message: 'If that email is registered, password reset instructions will be sent.',
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller for resetting passwords with token
//POST: /api/users/reset-password

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body
        if (!token || !password) {
            return res.status(400).json({ message: 'Token and new password are required' })
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        })

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined

        await user.save()

        return res.status(200).json({ message: 'Password has been reset successfully' })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller for getting user by id
//GET: /api/users/data

export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        //check if user exists
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        //return user
        user.password = undefined;
        return res.status(200).json({user})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }

}

//controller for getting user resumes
// GET: /api/users/resumes

export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;
        const resumes = await Resume.find({ userId });
        return res.status(200).json({ resumes });
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// ── Google OAuth ─────────────────────────────────────────────────────
// POST: /api/users/google-auth
// Receives the access_token from @react-oauth/google on the client,
// verifies it with Google's userinfo endpoint (no extra package needed),
// then finds or creates the user and returns our own JWT.

export const googleAuth = async (req, res) => {
    try {
        const { access_token } = req.body

        if (!access_token) {
            return res.status(400).json({ message: 'Google access token is required' })
        }

        // 1. Verify the access_token and fetch the user's Google profile
        const googleRes = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
        )

        if (!googleRes.ok) {
            return res.status(401).json({ message: 'Invalid or expired Google token' })
        }

        const profile = await googleRes.json()

        if (!profile.email) {
            return res.status(401).json({ message: 'Could not retrieve email from Google' })
        }

        // 2. Find existing user by email, or create a new one
        let user = await User.findOne({ email: profile.email })

        if (!user) {
            // New Google user — no password needed
            user = await User.create({
                name:     profile.name  || profile.email.split('@')[0],
                email:    profile.email,
                googleId: profile.sub,
                password: null,
            })
        } else if (!user.googleId) {
            // Existing email/password user signing in with Google for the first time
            // Link the Google account to their existing profile
            user.googleId = profile.sub
            await user.save()
        }

        // 3. Issue our own JWT (same helper used everywhere else)
        const token = generateToken(user._id)

        // Strip password before sending
        user.password = undefined

        return res.status(200).json({
            message: 'Signed in with Google',
            token,
            user,
        })
    } catch (error) {
        console.error('Google auth error:', error)
        return res.status(500).json({ message: 'Google sign-in failed. Please try again.' })
    }
}
