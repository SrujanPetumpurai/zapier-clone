import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { ZapSchema } from "../types/index.js";
import {prismaClient} from '../prismaClient/index.js'
import { Prisma } from "@prisma/client";

export const zapsRouter = Router();

//to create a zap   
zapsRouter.post('/',authMiddleware,async(req,res)=>{
    const parsedBody = ZapSchema.safeParse(req.body)
    if(!parsedBody.success){
        return res.status(400).json({
            message:"Input format not correct"
        })
    }

    const zapId = await prismaClient.$transaction(async (tx:Prisma.TransactionClient)=>{
        const zap = await tx.zap.create({
        data: {
                name: parsedBody.data.name,
                // @ts-ignore
                userId: req.id,
                actions: {
                    create: parsedBody.data.actions.map((x, index) => ({
                    type:{
                        connect:{id:x.availableActionId}
                    },
                    actionMetadata: x.actionMetadata ?? {},   
                    sortingOrder: index,
                    })),
                },
            },
    })
     await tx.trigger.create({
    data: {
       type:{
        connect:{id:parsedBody.data.availableTriggerId}
       } ,
      zap:{
        connect:{
            id:zap.id
        }
      },
      triggerMetadata: parsedBody.data.triggerMetadata ?? {}, 
    },
  });
    return zap.id
    })
    res.status(200).json({
        zapId
    })
})

//To get all zaps of the user
zapsRouter.get('/',authMiddleware,async(req,res)=>{
    //@ts-ignore
    const userId = req.id
    const zaps = await prismaClient.zap.findMany({
        where:{
            userId:userId,
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        }
    })
    return res.status(200).json({
        zaps
    })
})


//to get a particular zap from a id. 
zapsRouter.get('/:zapId',authMiddleware,async(req,res)=>{
    //@ts-ignore
    const id = req.id
    const zapId = req.params.zapId;
    if(!zapId){
        return res.status(400).json({message:"ZapId is required!"})
    }
    const zap = await prismaClient.zap.findUnique({
        where:{
            id:zapId?.toString(),
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        }
        
    })
    return res.json({
        zap
    })
})