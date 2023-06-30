import { Schema, model}from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    email:string
    avatar:string
    selectedList:string
    password:string
    sessionToken:string
    refreshToken:string
    
}

const userSchema=new Schema({
    email: {type:String, required: true},
    avatar:{
        type:String,
        default:"/incognito.jpg",
    },
    selectedList:
        {
            type:Schema.Types.ObjectId,
            ref:"List",
        }
    ,
    password:{
        type:String,
        required:true,
    },
    sessionToken:{
        type:String,
        default:''
    },
    refreshToken:{
        type:String,
        default:''
    }
},
{
    timestamps:true
})

userSchema.pre('save',async function (next){
    const salt=bcrypt.genSaltSync(10); 
    this.password=await bcrypt.hash(this.password, salt)
})

export const User=model<IUser>('User', userSchema);