import { Router } from "express"
import { UserController } from "../controllers/user.controller"

export const userRoutes = () => {
    const router = Router()
    const controller = new UserController()

    router.post("/", controller.register)
    router.get("/", controller.list)
    router.delete("/:id", controller.delete)
    router.put("/:id", controller.update)

    return router
}