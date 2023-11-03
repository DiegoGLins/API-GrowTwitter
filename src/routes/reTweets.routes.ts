import { Router } from "express"
import authMiddleware from "../middlewares/auth.middleware"
import TweetController from "../controllers/tweet.controller"


export const reTweetsRoutes = () => {
    const router = Router()
    const controller = new TweetController()

    router.post("/", authMiddleware, controller.createReTweet)


    return router
}