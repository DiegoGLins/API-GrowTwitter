import { Router } from 'express'
import validateUserMiddleware from "../middlewares/validate.middleware";
import AuthController from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

export const authRoutes = () => {
    const router = Router()
    const controller = new AuthController()

    router.post("/login", validateUserMiddleware, controller.login)
    // router.get("/logout", authMiddleware, controller.logout)
    return router
}
