// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})


connectDB()
    .then(() => {
        if (!process.env.VERCEL) {
            app.listen(process.env.PORT, () => {
                console.log(`The app is listening at port ${process.env.PORT}`)
            })
        }
    })
    .catch((error) => {
        console.log("Error connecting to the database", error)
    })

export default app;









// import mongoose from "mongoose";
// import express from "express";
// import { DB_NAME } from "./constants";
// const app = express();

// (async () => {
//     try {
//         const dbConnect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log(error)
//             throw error
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`The app is listening at port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log(error)
//         throw error
//     }
// })()