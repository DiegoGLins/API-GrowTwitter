import { NextFunction, Request, Response } from "express";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, email, paswword } = req.body

        if (!username || !email || !paswword) {
            return res.status(401).send({
                ok: false,
                code: 401,
                message: "Autenticação do login falhou"
            })
        }
        next()
    } catch (error: any) {
        return res.status(500).send({
            message: error.toString()
        })
    }
}

export default authMiddleware