import { Router } from "express"
import { UserController } from "../controllers/user.controller"
import validateUserMiddleware from "../middlewares/validate.middleware"
import authMiddleware from "../middlewares/auth.middleware"

export const userRoutes = () => {
    const router = Router()
    const controller = new UserController()

    router.post("/", validateUserMiddleware, controller.register)

    router.get("/", controller.list)
    router.delete("/:id", authMiddleware, controller.delete)
    router.put("/:id", authMiddleware, controller.update)

    return router
}