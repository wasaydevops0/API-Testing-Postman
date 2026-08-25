import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'

const app = express();

app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ limit: '100kb', extended: true }))
app.use(express.static('public'))
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use(cookieParser())


//import routes
import router from './routes/user.routes.js';
//routes decleration
app.use("/api/v1/users", router);

// Global Error Handler (Converts all errors to JSON instead of HTML)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message: message,
        errors: err.errors || [],
        // Optionally include stack trace during development for easier debugging
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

export { app }