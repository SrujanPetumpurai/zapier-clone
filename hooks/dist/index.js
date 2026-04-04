import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import cors from 'cors';
import { triggerNormalizers } from "./normaliser.js";
const client = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
// password logic
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    console.log(`this is req.body, ${body}`);
    const zap = await client.zap.findFirst({
        where: {
            id: zapId
        },
        include: {
            trigger: {
                select: { triggerId: true }
            }
        }
    });
    const triggerType = zap?.trigger?.triggerId;
    if (!triggerType) {
        return console.log("No trigger type in index.ts of hooks");
    }
    const normaliser = triggerNormalizers[triggerType];
    if (!normaliser) {
        console.log(`No normalizer found for triggerType:${triggerType}`);
        return res.status(400).json({ message: "Unsupported trigger type" });
    }
    const result = normaliser(body);
    try {
        await client.$transaction(async (tx) => {
            const run = await tx.zapRun.create({
                data: {
                    zap: { connect: { id: zapId } },
                    metadata: result
                }
            });
            ;
            await tx.zapRunOutbox.create({
                data: {
                    zapRun: {
                        connect: { id: run.id }
                    }
                }
            });
        });
        res.json({
            message: "Webhook received"
        });
    }
    catch (e) {
        res.json({
            message: "Unable to trigger the hook"
        });
    }
});
app.listen(3002);
console.log('listening to 3002');
//# sourceMappingURL=index.js.map