    import express from "express"
    import { PrismaClient,Prisma } from "@prisma/client";
    import cors from 'cors'
    const client = new PrismaClient();

    const app = express();
    app.use(cors())
    app.use(express.json());
    // password logic
    app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
        const userId = req.params.userId;
        const zapId = req.params.zapId;
        const body = req.body;

        try{
            await client.$transaction(async (tx:Prisma.TransactionClient) => {
            const run = await tx.zapRun.create({
                data: {
                    zap:{connect:{id:zapId}},
                    metadata: body
                }
            });;

            await tx.zapRunOutbox.create({
                data: {
                    zapRun:{
                        connect:{id:run.id}
                    }
                }
            })
        })
        res.json({
            message: "Webhook received"
        })
        }catch(e){
            res.json({
                message:"Unable to trigger the hook"
            })
        }
        
    })

    app.listen(3002);
    console.log('listening to 3002')