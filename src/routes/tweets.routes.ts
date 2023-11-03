import { Router } from "express"
import tweetController from "../controllers/tweet.controller"
import authMiddleware from "../middlewares/auth.middleware"


export const tweetsRoutes = () => {
    const router = Router()
    const controller = new tweetController()

    router.get("/fromUser", authMiddleware, controller.listTweetsFromUser)

    router.post("/", authMiddleware, controller.createTweet)
    router.post("/", authMiddleware, controller.createReTweet)

    router.get('/', authMiddleware, controller.listAllTweets)
    router.get("/:idTweet", authMiddleware, controller.listTweetByID)
    router.put("/:idTweet", authMiddleware, controller.updateTweet)
    router.delete("/:idTweet", authMiddleware, controller.deleteTweet)

    return router
}

