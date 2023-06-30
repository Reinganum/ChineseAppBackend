import mongoose from "mongoose";
import { IUser } from "./user";

type character = {
    character: string,
    pronunciation:string,
    definition:string,
    strokes: string,
}

export interface IList {
    name:string,
    characters:character[],
    public:boolean,
    views: number,
    creator: string,
    subscriptors: IUser[],
    description: string,
}

const listSchema=new mongoose.Schema({
    name:{
        type:String,
        default:'My list'
    },
    characters:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Character",
        }
    ],
    description:{
        type: String,
        default:'Newly created list'
    },
    public:
        {
            type:Boolean,
            default:false
        },
    views:{
        type:Number,
        default:0    
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    subscriptors:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ]
},
{
    timestamps:true
})

export const List=mongoose.model('List', listSchema);