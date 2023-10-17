import { Router } from "express"
import tweetController from "../controllers/tweet.controller"
import authMiddleware from "../middlewares/auth.middleware"


export const tweetsRoutes = () => {
    const router = Router()
    const controller = new tweetController()

    router.post("/", authMiddleware, controller.create)

    router.get("/", authMiddleware, controller.listTweets)
    router.put("/:idTweet", authMiddleware, controller.updateTweet)
    router.delete("/:idTweet", authMiddleware, controller.delete)

    return router
}

