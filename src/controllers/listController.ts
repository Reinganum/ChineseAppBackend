import express from 'express';
import { User } from '../models/user';
import { List } from '../models/list';
import { Character } from '../models/character';


export const getMyLists=async(req:express.Request, res:express.Response)=>{
    try{
        const lists=await List.find({creator:req.userId});
        if (lists.length===0){
            const newList=await List.create({creator:req.userId})
            const user=User.findByIdAndUpdate(req.userId,{selectedList:newList._id})
            res.json([newList])
        } else {
            res.json(lists)
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateMyListName=async(req:express.Request, res:express.Response)=>{
    try{
        const {newName}=req.body
        const updatedList=await User.findOneAndUpdate({creator:req.userId},{newName},{new:true})
        res.json(updatedList)
    } catch (error){
        console.log(error)
    }
}

export const changeListVisibility=async(req:express.Request, res:express.Response)=>{
    try{
        const newData=req.body
        const updatedList=await User.findOneAndUpdate({creator:req.userId},newData,{new:true})
        res.json(updatedList)
    } catch (error){
        console.log(error)
    }
}

export const addCharacterToList = async (req:express.Request, res:express.Response)=>{
    console.log('new character pinchado')
    try{
        const {newCharacter,list}=req.body;

        const {string,kDefinition,kMandarin,kTotalStrokes}=newCharacter;
        const characterExistsInDb=await Character.findOne({string:string})
        if(!characterExistsInDb){
            console.log('character not in db')
            const newCharactertoAdd=await Character.create({
                string,
                kDefinition,
                kMandarin,
                kTotalStrokes,
                rating:[
                    {
                        studentId:req.userId,
                        grade:0,
                        visits:0
                    }
                ]
            })
            const updatedList=await List.findByIdAndUpdate(
                list,
                {
                    $addToSet:{
                        characters:newCharactertoAdd
                    },
                }
            )
            res.json(updatedList)
        } else {
            console.log('character already in db')
            const charIsInUserList=characterExistsInDb.rating.find((char)=>char.studentId===req.userId)
            if (!charIsInUserList){
                console.log("character not stored in user list yet");
                const updatedChar=await Character.findOneAndUpdate({string}, {$push:{rating:{studentId:req.userId,grade:0,visits:0}}},{new:true})
                const updatedList=await List.findByIdAndUpdate(
                    list, 
                    {
                        $addToSet:{
                            characters:characterExistsInDb
                        }
                })
                res.json(updatedList)
            } else {
                console.log('character already stored in list')
                console.log(charIsInUserList)
                const updatedList=await List.findByIdAndUpdate(
                list,
                {
                    $addToSet:{
                        characters:characterExistsInDb
                    }
                })    
                res.json(updatedList)
            }
        }
    } catch (error){
        console.log(error)
    }
}

export const removeList=async(req:express.Request, res:express.Response)=>{
    const {_id}=req.body
    const removeList=await List.findByIdAndRemove(_id)
    res.json(removeList)
}

export const listWithPopulatedCharacters=async(req:express.Request, res:express.Response)=>{
    const {listID}=req.body;
    try{
        console.log('populated list pinchado')
        const response=await List.findById(listID).populate('characters')
        console.log(response)
        res.json(response)
    } catch (error){
        console.log(error)
    }
}

export const selectList=async(req:express.Request, res:express.Response)=>{
    const {listID}=req.body;
    try{
        const updatedList=await User.findByIdAndUpdate(req.userId,{selectedList:listID},{new:true});
        res.json(updatedList)
    } catch (error){
        console.log(error)
    }    
}

export const getSelectedList=async(req:express.Request, res:express.Response)=>{
    const user=await User.findById(req.userId);
    const listID=user.selectedList.toString()
    console.log('listID')
    console.log(listID)
    try {
        const selectedList=await List.findById(listID).populate('characters')
        console.log(selectedList)
        res.json(selectedList)
    } catch (error) {
        console.log(error)
    }
}

export const createList=async(req:express.Request, res:express.Response)=>{
    const {name, description}=req.body
    console.log(name)
    try {
        const listIsNew=await List.find({name:name,description: "newly created list", creator:req.userId})
        console.log(listIsNew)
        if(listIsNew.length===0){
            console.log('yes length is zero')
            const newList=await List.create({name,description,creator:req.userId})
            res.json(newList)
        } else {
            res.json({error:'List name already exists'})
        }
    } catch (error){
        console.log(error)
    }
}

export const studyCounter=async(req:express.Request, res:express.Response)=>{
    const {_id}=req.body;
    const userId=req.userId;
    try {
        const charToUpdate=await Character.findById({_id});
        const indexToUpdate=charToUpdate.rating.findIndex((rating)=>rating.studentId===userId);
        charToUpdate.rating[indexToUpdate].visits+1;
        const response=await Character.findByIdAndUpdate({_id},{rating:charToUpdate})
    } catch (error){
        console.log(error)
    }
}