import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/auth.routes";

dotenv.config()
const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes())
app.use("/users", userRoutes())

const port = process.env.PORT

app.listen(port, () => {
    console.log(`API está rodando na porta ${port} `);
});

app.get("/", (req: Request, res: Response) => {
    return res.status(200).send({ sucess: true, mesage: "API - GrowTwiter" })
});
