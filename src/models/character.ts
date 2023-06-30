import mongoose from "mongoose";

const characterSchema=new mongoose.Schema({
   string: {
    type: String,
   },
   kMandarin: String,
   kDefinition: String,
   kTotalStrokes: Number,
   rating: []
},
{
    timestamps:true
})

export const Character=mongoose.model('Character', characterSchema);