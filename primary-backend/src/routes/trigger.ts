import { Router } from "express";
import {prismaClient} from '../prismaClient/index.js'
import { SignupSchema,SigninSchema } from "../types/index.js";
import { authMiddleware } from "../middleware.js";
import  jwt  from "jsonwebtoken"

export const triggerRouter = Router();


triggerRouter.get('/',authMiddleware,async(req,res)=>{
    const triggerTypes = await prismaClient.availableTrigger.findMany({
        select:{
            id:true,name:true,image:true
        }
    })
    if(triggerTypes){
        return res.status(200).json({
            message:'take all the trigger types',
            triggerTypes
        })
    }
    return res.status(401).json({
        message:"Don't know why we couldn't give you available trigger types"
    })
})    