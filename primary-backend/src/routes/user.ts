import { Router } from "express";
import {prismaClient} from '../prismaClient/index.js'
import { SignupSchema,SigninSchema } from "../types/index.js";
import { authMiddleware } from "../middleware.js";
import  jwt  from "jsonwebtoken"

export const userRouter = Router();


userRouter.post('/signup',async(req,res)=>{
    const body = req.body;
    const parsedBody = SignupSchema.safeParse(body);
    if(!parsedBody.success){
        return res.status(400).json({
            message:"Incorrect Inputs"
        })
    }
    const userExists = await prismaClient.user.findFirst({
            where:{
                email:parsedBody.data.email
            }
    })
    if(userExists){
        return res.status(400).json({
            message:"User already exists"
        })
    }

    const user = await prismaClient.user.create({
        data:{
            email:parsedBody.data.email,
            password:parsedBody.data.password,
            name:parsedBody.data.name
        }
    })
    //send email
    const JWT_PASSWORD= process.env.JWT_PASSWORD
     if(!JWT_PASSWORD){
        throw new Error("JWT_PASSWORD doesn't exists");
    }
    const token = jwt.sign({id:user.id},JWT_PASSWORD)
    
    res.status(200).json({
        token:token,
        message:"Please verify your account by checking your email"
    })

})

userRouter.post('/login',async(req,res)=>{
    const body = req.body
    const parsedbody = SigninSchema.safeParse(body);
    if(!parsedbody.success){
        return res.status(400).json({
            message:'Incorrect Input Fromat'
        })
    }
    const userExists = await prismaClient.user.findFirst({
        where:{
            email:parsedbody.data.email,
            password:parsedbody.data.password
        }
    })
    if(!userExists){
        return res.status(404).json({
            message:'User does not exists'
        })
    }
    
    const JWT_PASSWORD = process.env.JWT_PASSWORD 

    if(!JWT_PASSWORD){
        throw new Error("JWT_PASSWORD doesn't exists");
    }
    const token = jwt.sign({id:userExists.id},JWT_PASSWORD)
    res.json({
        token:token
    })
})

//to get user details

userRouter.get('/',authMiddleware,async(req,res)=>{
    //@ts-ignore
    const id = req.id
    const user = await prismaClient.user.findFirst({
        where:{
            id:id
        },
        select:{
            name:true,
            email:true
        }
    })
    if(!user){
        return res.status(401).json({
            message:"Couldn't find your details"
        })
    }
    res.status(200).json({
        user:user
    })
})