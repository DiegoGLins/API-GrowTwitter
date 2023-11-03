import { Router } from "express"
import authMiddleware from "../middlewares/auth.middleware"
import TweetController from "../controllers/tweet.controller"


export const reTweetsRoutes = () => {
    const router = Router()
    const controller = new TweetController()

    router.post("/", authMiddleware, controller.createReTweet)
    // router.get("/", authMiddleware, controller.listReTweets)
    // router.put("/:idReTweet", authMiddleware, controller.updateReTweet)
    // router.delete("/:idReTweet", authMiddleware, controller.deleteReTweet)

    return router
}