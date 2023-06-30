import "dotenv/config.js";
import jwt from 'jsonwebtoken';

export const generateToken=(id:string):string=>{
    return jwt.sign(
        {_id:id},
        process.env.JWT_SECRET, 
        {expiresIn: '3d'})
}
