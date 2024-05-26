// Suggested code may be subject to a license. Learn more: ~LicenseLog:4061710673.
// require( "dotenv").config({path:"./env"})

import dotenv from "dotenv"

import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:"./env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server running on port ${process.env.PORT}`)
    })
})
.catch(()=>{
    console.error("error connecting to db" , err)
})










// import express from "express";

// const app = express();

// ;(async ()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error" , (error)=>{
//         console.error("error connecting to db" , error)
//         throw error
//        })

//        app.listen(process.env.PORT , ()=>{
//         console.log(`server running on port ${process.env.PORT}`)
//        })
//     } catch (error) {
//         console.error("error:" , error)
//         throw error
//     }

// })()