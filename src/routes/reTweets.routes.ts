import { Router } from "express"
import ReTweetController from "../controllers/reTweet.controller"
import authMiddleware from "../middlewares/auth.middleware"

export const reTweetsRoutes = () => {
    const router = Router()
    const controller = new ReTweetController()

    router.post("/", authMiddleware, controller.create)

    // router.get("/", authMiddleware, controller.listTweets)
    // router.put("/:idReTweet", authMiddleware, controller.updateTweet)
    // router.delete("/:idReTweet", authMiddleware, controller.delete)

    return router
}