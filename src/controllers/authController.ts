import express from 'express';
import bcrypt from 'bcrypt'
import { User} from '../models/user';
import { generateToken } from '../service/jwt';
import { SessionData } from 'express-session';
import { signRefreshToken } from '../service/signRefreshToken';
import  jwt, { JsonWebTokenError }  from 'jsonwebtoken';


declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}

type decodedJWT={
    id:string
}


export const login = async (req:express.Request, res:express.Response)=>{
    try{
        const {email,password}=req.body
        if (!email || !password){
            return res.sendStatus(400);
        }
        const user = await User.findOne({email})
        if (!user){
            return res.sendStatus(400);
        }
        if (user&&await bcrypt.compare(password, user.password)){
            try{
                const refreshToken=signRefreshToken(user._id.toString())
                const updateUser=await User.findByIdAndUpdate(user._id,{refreshToken},{new:true})
                res.cookie('refreshToken',refreshToken, {
                    httpOnly:true,
                    maxAge: 24 * 60 * 60 * 1000,
                })
                const accessToken=generateToken(user?._id.toString());
                res.json({
                    userId:user._id,
                    accessToken,
                    selectedList:user.selectedList,
                    avatar:user.avatar,
                    auth:true
                })
            }catch(error){
                console.log(error)
            }
        } else {
            return res.sendStatus(401);
        }
    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async(req:express.Request, res:express.Response)=>{
    try{
        console.log('register')
        const {email,password}=req.body;
        if(!email || !password){
            return res.sendStatus(400);
        }
        const userAlreadyExists=await User.findOne({email})
        if(userAlreadyExists){
            return res.sendStatus(400);
        }
        const newUser=User.create({email,password})
        return res.json(newUser)
    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const handleRefreshToken=async(req:express.Request, res:express.Response)=>{
    const cookie=req.cookies
    if(!cookie?.refreshToken)return res.sendStatus(401)
    const refreshToken=cookie.refreshToken
    jwt.verify(refreshToken,process.env.JWT_SECRET,async(error:JsonWebTokenError,decoded:decodedJWT)=>{
        if (error) return res.status(403).json({ message: 'Forbidden' });
        const foundUser = await User.findOne({ _id: decoded.id }).exec();
        if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });
        const accessToken = jwt.sign(
            {
                _id:foundUser._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )
        res.json({accessToken:accessToken,selectedList:foundUser.selectedList,auth:true,userId:foundUser._id, avatar:foundUser.avatar});
    })
}