import { Router } from "express"
import { FollowController } from "../controllers/follow.controller"
import authMiddleware from "../middlewares/auth.middleware"


export const followRoutes = () => {
    const router = Router()
    const controller = new FollowController

    router.get("/", authMiddleware, controller.list)
    router.post("/:idUserFollowing", authMiddleware, controller.addFollow)
    router.delete("/:idUserFollowing", authMiddleware, controller.deleteFollow)

    return router
}