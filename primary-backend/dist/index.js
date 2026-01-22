import express from 'express';
import { userRouter } from './routes/user.js';
import { zapsRouter } from './routes/zaps.js';
import { triggerRouter } from './routes/trigger.js';
import { actionRouter } from './routes/action.js';
import cors from 'cors';
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use('/user', userRouter);
app.use('/zaps', zapsRouter);
app.use('/trigger', triggerRouter);
app.use('/action', actionRouter);
app.listen(4000, () => {
    console.log("listening on 4000");
});
//# sourceMappingURL=index.js.map