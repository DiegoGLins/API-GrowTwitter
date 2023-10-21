import { Router } from "express"
import authMiddleware from "../middlewares/auth.middleware"
import LikerController from "../controllers/liker.controller"

export const likesRoutes = () => {
    const router = Router()
    const controller = new LikerController()

    router.get("/:idTweet", authMiddleware, controller.createLike)
    router.get("/reTweet/:idReTweet", authMiddleware, controller.createLikeR)
    router.get("/", authMiddleware, controller.listLike)

    return router
}