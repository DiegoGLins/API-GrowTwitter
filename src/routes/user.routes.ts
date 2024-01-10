import { Router } from "express"
import { UserController } from "../controllers/user.controller"
import authMiddleware from "../middlewares/auth.middleware"
import registerMiddleware from "../middlewares/register.middleware"

export const userRoutes = () => {
    const router = Router()
    const controller = new UserController()
    router.get('/byId', authMiddleware, controller.listById)
    router.post("/", registerMiddleware, controller.register)

    router.get("/", authMiddleware, controller.list)
    router.delete("/:id", authMiddleware, controller.delete)
    router.put("/:id", authMiddleware, controller.update)

    return router
}