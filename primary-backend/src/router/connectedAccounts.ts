import { Router } from "express";
import { prisma } from '../lib/db.js'
import { authMiddleware } from "../middleware.js";

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.id

  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: { connectedAccount: true }  
  })

  const accounts = user?.connectedAccount;
  res.json({ accounts })
})

export const connectedAccount = router;