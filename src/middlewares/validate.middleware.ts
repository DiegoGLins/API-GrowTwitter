import { NextFunction, Request, Response } from "express";

async function validateUserMiddleware(req: Request, res: Response, next: NextFunction) {

    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).send({
            ok: false,
            code: 400,
            message: "Username, email ou password não fornecidos"
        })
    }
    next()
}

export default validateUserMiddleware