import { NextFunction, Request, Response } from "express";

async function registerMiddleware(req: Request, res: Response, next: NextFunction) {

    const { username, password, name, email } = req.body

    if (!username || !password || !name || !email) {
        return res.status(400).send({
            ok: false,
            code: 400,
            message: "Por favor informe todos os campos"
        })
    }

    if (name.length > 18) {
        return {
            ok: false,
            code: 400,
            message: "nome deve ter no máximo 18 caracteres."
        };
    }

    if (username.length > 16) {
        return {
            ok: false,
            code: 400,
            message: "username deve ter no máximo 16 caracteres."
        };
    }
    next()
}

export default registerMiddleware