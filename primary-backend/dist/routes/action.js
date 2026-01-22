import { Router } from "express";
import { prismaClient } from '../prismaClient/index.js';
import { SignupSchema, SigninSchema } from "../types/index.js";
import { authMiddleware } from "../middleware.js";
import jwt from "jsonwebtoken";
export const actionRouter = Router();
//actionTypes
actionRouter.get('/', authMiddleware, async (req, res) => {
    const actionTypes = await prismaClient.availableAction.findMany({
        select: { id: true, name: true, image: true }
    });
    if (actionTypes) {
        return res.status(200).json({
            message: 'take all the action types',
            actionTypes
        });
    }
    return res.status(401).json({
        message: "Don't know why we couldn't give you available action types"
    });
});
//# sourceMappingURL=action.js.map