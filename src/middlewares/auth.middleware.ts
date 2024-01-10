import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers.authorization

        if (!authorization) {
            return res.status(401).send({
                code: 401,
                message: "Autenticação do token falhou"
            })
        }

        const decoded = authorization.split(" ")[1]
        const verify = jwt.verify(decoded, process.env.SECRET_WORD || "")

        req.authUser = verify as {
            id: string;
            name: string;
            username: string;
            avatar: string;
            email: string
        }

        next()
    } catch (error: any) {
        return res.status(500).send({
            message: error.toString()
        })
    }
}

export default authMiddleware