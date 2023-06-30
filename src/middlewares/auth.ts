import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { NextFunction, Request, Response } from "express";

declare module 'jsonwebtoken' {
    export interface UserIDJwtPayload extends jwt.JwtPayload {
        userId: string
    }
}

const auth=async(req:Request,res:Response, next:NextFunction)=>{
    let token;
    if(!req?.headers?.authorization?.startsWith("Bearer")){
        res.json({Error: "user is not authenticated"})
    }
    try{    
        if (req?.headers?.authorization?.startsWith("Bearer")){
            token=(req.headers.authorization.split(' ')[1])
            console.log('token in auth')
            console.log(token)
            const decoded=<jwt.UserIDJwtPayload>jwt.verify(token, process.env.JWT_SECRET,);
            console.log(decoded)
            req.userId=decoded._id
            next()
        }  
    }catch(error){
        console.log(`error in the auth middleware login: ${error.name}`);
        return res.sendStatus(401);
    }
}

export {auth};