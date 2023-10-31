import { Router } from "express"
import tweetController from "../controllers/tweet.controller"
import authMiddleware from "../middlewares/auth.middleware"


export const tweetsRoutes = () => {
    const router = Router()
    const controller = new tweetController()

    router.post("/", authMiddleware, controller.createTweet)
    router.get('/', authMiddleware, controller.listAllTweets)
    router.get("/:idTweet", authMiddleware, controller.listTweetByID)
    router.get("/fromUser", authMiddleware, controller.listTweetsFromUser)
    router.put("/:idTweet", authMiddleware, controller.updateTweet)
    router.delete("/:idTweet", authMiddleware, controller.deleteTweet)

    return router
}

