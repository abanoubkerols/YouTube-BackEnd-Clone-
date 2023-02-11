import express from "express";
import dotenv from "dotenv"
import { connect } from 'mongoose'
import AuthRoutes from './Src/Routers/auth.route.js'
import VideoRouts from './Src/Routers/video.route.js'
 dotenv.config()

const server = express()

server.use(express.json())

const mongodatabase = process.env.mongoURI

const port = process.env.port
// dataBase Connection 
await connect(mongodatabase).then(() => {

    console.log("database work");

}).catch((err) => {

    console.log("wrong connection", err);
})

server.use(AuthRoutes)
server.use(VideoRouts)


server.listen(port, () => {

    console.log("server work on port " + port);
})


