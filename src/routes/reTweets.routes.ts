import { Router } from "express"
import ReTweetController from "../controllers/reTweet.controller"
import authMiddleware from "../middlewares/auth.middleware"

export const reTweetsRoutes = () => {
    const router = Router()
    const controller = new ReTweetController()

    router.post("/", authMiddleware, controller.createReTweet)

    router.get("/", authMiddleware, controller.listReTweets)
    router.put("/:idReTweet", authMiddleware, controller.updateReTweet)
    router.delete("/:idReTweet", authMiddleware, controller.deleteReTweet)

    return router
}