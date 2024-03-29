import { Router } from 'express'
import validateUserMiddleware from "../middlewares/validate.middleware";
import AuthController from '../controllers/auth.controller';

export const authRoutes = () => {
    const router = Router()
    const controller = new AuthController()

    router.post("/login", validateUserMiddleware, controller.login)
    return router
}
