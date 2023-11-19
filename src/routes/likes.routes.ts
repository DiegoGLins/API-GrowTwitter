import { Router } from "express"
import authMiddleware from "../middlewares/auth.middleware"
import LikerController from "../controllers/liker.controller"

export const likesRoutes = () => {
    const router = Router()
    const controller = new LikerController()

    router.post("/", authMiddleware, controller.createLike)
    router.get("/", authMiddleware, controller.listLike)

    return router
}