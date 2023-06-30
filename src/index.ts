import express from 'express';
import dotenv from "dotenv";
import http from 'http';
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose, { Error } from 'mongoose';
import {authRouter, listRouter, studyRouter} from './routers';
import session from 'express-session';
import MongoStore from 'connect-mongo';
dotenv.config()
const sessionOptions={
    store:MongoStore.create({
        mongoUrl:process.env.MONGO_URL,
        dbName:process.env.MONGO_DB_NAME,
        collectionName:'sessions',
        ttl: 14 * 24 * 60 * 60 
    }),
    secret:'secreto',
    resave:false,
    saveUninitialized:false,
    cookie : {
        sameSite: false,
        maxAge: 24 * 60 * 60,
        httpOnly: true,
    }
}
const app=express();
app.use(session(sessionOptions));
app.use('/avatar', express.static(process.env.STATIC_ROOT));
const server = http.createServer(app);
server.listen(process.env.PORT, ()=>{
    console.log(`Server listening on http://localhost:${process.env.PORT}/`)
})
app.use(cors({
    origin: ["http://localhost:3000","http://localhost:5000"],
    credentials:true,
}))
app.use(express.static('public'));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/auth',authRouter());
app.use('/list',listRouter());
app.use('/study',studyRouter());
mongoose.Promise=Promise;
mongoose.connect(process.env.MONGO_URL,{
    dbName: 'ChineseApp'
});
mongoose.connection.on('error',(error:Error)=>{
    console.log(error)
})


