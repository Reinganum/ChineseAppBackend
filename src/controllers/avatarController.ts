import { User} from '../models/user';
import express from 'express';

const saveAvatar=async(userId:string,avatar:string)=>{
    try{
        await User.findByIdAndUpdate(userId,{avatar},{new:true})
    }catch(error){
        console.log(error)
}}

const renderAvatar=async(req:express.Request,res:express.Response)=>{
    const user=await User.findById(req.userId);
    const avatar=`../uploads/${user.avatar}`
    res.send({avatar:avatar})
}

export const updateAvatar=(req:express.Request,res:express.Response)=>{
    console.log("we made it to the updateAvatar")
     if(!req.userId){
        console.log("no user in the req")
     }
     const {file}=req
     saveAvatar(req.userId,`${file.filename}`)
     res.send({avatar:`${file.filename}`})
}

