import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';

import { swaggerDocument } from './swagger.js';
const app = express();

app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ limit: '100kb', extended: true }))
app.use(express.static('public'))
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use(cookieParser())


// Swagger API Documentation Route
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Swagger UI</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              spec: ${JSON.stringify(swaggerDocument)},
              dom_id: '#swagger-ui',
            });
          };
        </script>
      </body>
    </html>
  `);
});

//import routes
import router from './routes/user.routes.js';
//routes decleration
app.use("/api/v1/users", router);

// Catch-all route for undefined API endpoints
app.use((req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on the server`);
    error.statusCode = 404;
    next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle Mongoose CastError (Invalid ID)
    if (err.name === "CastError") {
        message = `Resource not found. Invalid: ${err.path}`;
        statusCode = 400;
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        statusCode = 400; // Or 409 Conflict
    }

    // Handle Mongoose Validation Error
    if (err.name === "ValidationError") {
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }

    // Handle JWT Error
    if (err.name === "JsonWebTokenError") {
        message = "JSON Web Token is invalid. Try Again!!!";
        statusCode = 401;
    }

    // Handle JWT Expired Error
    if (err.name === "TokenExpiredError") {
        message = "JSON Web Token is expired. Try Again!!!";
        statusCode = 401;
    }

    return res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message: message,
        errors: err.errors || [],
        // Optionally include stack trace during development for easier debugging
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

export { app }