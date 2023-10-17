import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).send({
                code: 401,
                message: "Autenticação do token falhou"
            })
        }

        const user = await userService.getByToken(token)

        if (!user) {
            return res.status(401).send({
                code: 401,
                message: "Autenticação do token falhou"
            })
        }

        req.body.idUser = user.id

        next()
    } catch (error: any) {
        return res.status(500).send({
            message: error.toString()
        })
    }
}

export default authMiddleware