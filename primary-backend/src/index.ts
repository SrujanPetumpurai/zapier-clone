import express from "express";
import { userRouter } from "./router/user.js";
import { zapRouter } from "./router/zaps.js";
import cors from "cors";
import { triggerRouter } from "./router/trigger.js";
import { actionRouter } from "./router/action.js";
import { googleRouter } from "./router/google.js";
import { connectedAccount } from "./router/connectedAccounts.js";
import { providerRouter } from "./router/provider.js";
import { gmailRouter } from "./router/gmail.js";
const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter);

app.use("/api/v1/provider",providerRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use('/api/v1/connectedAccount',connectedAccount)
app.use("/api/v1/action", actionRouter);
app.use("/api/v1/google",googleRouter)
app.use("/api/v1/gmail",gmailRouter)


app.listen(3000);
console.log("Listening on 3000")