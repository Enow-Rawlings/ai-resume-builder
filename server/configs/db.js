import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=>{console.log("Database connected successfully")})

        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'resume-builder';

        if (!mongodbURI) {
            throw new Error("MONGODB_URI environment variable not set")
        }

        if (mongodbURI.endsWith('/')) {
            mongodbURI = mongodbURI.slice(0, -1)
        }

        const hasDatabase = /\/[^\/?]+(?=(\?|$))/.test(mongodbURI.replace(/\/+$/, ""));
        const connectionString = hasDatabase ? mongodbURI : `${mongodbURI}/${projectName}`;

        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
    }
}

export default connectDB