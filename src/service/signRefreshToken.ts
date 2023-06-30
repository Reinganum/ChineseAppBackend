import jwt from 'jsonwebtoken';

export const signRefreshToken=(id:string)=>{
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:24 * 60 * 60 * 1000})
}
