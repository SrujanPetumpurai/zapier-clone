import type { NextFunction,Request,Response } from "express";
import  Jwt  from "jsonwebtoken";

export  function authMiddleware(req:Request,res:Response,next:NextFunction){
    const authheader = req.headers.authorization 
    console.log(req.headers)
    console.log(req.headers.authorization)
    console.log("Above me should be req.headers.authorization")
    if(!authheader){
        return res.status(401).json({
            message:"sigin before continuing"
        })
    }
    if(typeof authheader=='string'){
            const token = authheader.split(" ")[1];
            if(!token){
        return res.status(400).json({
            message:'singin please'
        })
    }
    if(!process.env.JWT_PASSWORD){
        throw new Error("Couldn't find the JWT PASSWORD (SRY)")
    }
    try{
        const payload = Jwt.verify(token,process.env.JWT_PASSWORD)
        //@ts-ignore
        req.id = payload.id
        next();
    }catch(e){
        return res.status(403).json({
            message:"You are not logged in"
        })
    }
    }

}