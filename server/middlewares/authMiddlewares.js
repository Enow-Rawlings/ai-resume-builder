import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {

    console.log("🔒 AUTH MIDDLEWARE HIT! Token received:", req.headers.authorization);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized'})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next();
    } catch (error) {
        return res.status(401).json({message: error.message})
    }
}

export default protect