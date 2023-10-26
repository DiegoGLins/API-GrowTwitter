import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/auth.routes";
import { tweetsRoutes } from "./routes/tweets.routes";
import { likesRoutes } from "./routes/likes.routes";
import { followRoutes } from "./routes/follow.routes";
import { reTweetsRoutes } from "./routes/reTweets.routes";

dotenv.config()
const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes())
app.use("/users", userRoutes())
app.use("/tweets", tweetsRoutes())
app.use("/reTweets", reTweetsRoutes())
app.use("/likes", likesRoutes())
app.use("/follows", followRoutes())

const port = process.env.PORT

app.get("/", (req: Request, res: Response) => {
    return res.status(200).send({ sucess: true, mesage: "API - GrowTwiter" })
});

app.listen(port, () => {
    console.log(`API está rodando na porta ${port} `);
});
