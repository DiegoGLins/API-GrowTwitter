import { NextFunction, Request, Response } from "express";

async function validateUserMiddleware(req: Request, res: Response, next: NextFunction) {

    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).send({
            ok: false,
            code: 400,
            message: "username ou password não fornecidos"
        })
    }
    next()
}

export default validateUserMiddleware