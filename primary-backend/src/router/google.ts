import { Router } from "express";
import {prisma} from '../lib/db.js'
import {google} from 'googleapis'
import { authMiddleware } from "../middleware.js";
const router = Router();
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/v1/gmail/callback' 
);
console.log("Env variables",process.env.GOOGLE_CLIENT_ID)
console.log("ABove me should be env variables")

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

router.get('/auth', authMiddleware,(req, res) => {
    try{
    const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',  
    scope: SCOPES,
    prompt: 'consent',
    //@ts-ignore
    state:req.id 
  });
  res.json({url:authUrl});
}catch(e){
    res.json({message:"Unable to send u to google gmail consent page"})
}
});

router.get('/callback',async(req,res)=>{
    const {code,state} = req.query;
    const userId = state as string;
    try{
        const {tokens} = await oauth2Client.getToken(code as string);
        if (!tokens.access_token) {
        res.status(400).json({ error: 'No access token received' });
        return;
        }
        await prisma.connectedAccount.upsert({
            where:{
                userId_providerId:{
                    //@ts-ignore
                    userId:userId,
                    provider:'gmail'
                },
            },
            update:{
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token??null,
                    expiryDate:tokens.expiry_date? new Date(tokens.expiry_date):'',
                },
            create:{
                //@ts-ignore
                user:{
                    connect:{//@ts-ignore 
                    id:req.id}},
                   provider:{
                    connect:{id:'gmail'}
                   } ,
                accessToken: tokens.access_token!,         
                refreshToken: tokens.refresh_token ?? '',
                expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) :"",
            }
        })
        return(
            res.redirect('http://localhost:4000/zap/create') 
    )
    }catch(e){
        console.error(e);
        res.status(500).json({message:"auth failed"})
    }
});

router.post('/send', authMiddleware,async (req, res) => {
    const { to, body } = req.body;
    try {
        const account = await prisma.connectedAccount.findUnique({
            where: {
                userId_providerId: {
                    //@ts-ignore
                    userId: req.id,
                    providerId: 'gmail'
                }
            }
        });

        if (!account) {
            res.status(401).json({ error: 'Gmail not connected' });
            return;
        }

        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
            expiry_date: account.expiryDate?.getTime()??null,
        });

        const messageParts = [
            `To: ${to}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            'Subject: Automated Email',
            '',
            body,
        ];
        const message = messageParts.join('\n');

        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        res.json({ success: true, messageId: response.data.id });
        console.log("succesfully email sent")

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

export const googleRouter = router;