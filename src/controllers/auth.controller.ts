import { Request, Response } from 'express'
import authService from '../services/auth.service'
class AuthController {
    public async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body

            if (!username || !password) {
                return res.status(404).json({
                    ok: false,
                    code: 400,
                    message: "Campos não informados"
                })
            }

            const result = await authService.login(username, password)

            if (result?.code === 200) {
                return res.status(result.code).json(result.data)
            }
        }

        catch (error: any) {
            res.status(500).send({
                ok: false,
                code: 500,
                message: error.toString()
            })
        }
    }

    // public async logout(req: Request, res: Response) {
    //     try {
    //         const { idUser } = req.body

    //         if (!idUser) {
    //             return res.status(401).send({
    //                 ok: false,
    //                 code: 401,
    //                 message: "Autenticação do token falhou",
    //             });
    //         }

    //         const userLogged = await userService.getById(idUser)

    //         if (userLogged) {
    //             const logged = userService.mapToModel(userLogged.data).detailUser()

    //             return res.status(200).send({
    //                 ok: true,
    //                 code: 200,
    //                 message: "Logout realizado com sucesso",
    //                 data: {
    //                     logged
    //                 }
    //             })
    //         }

    //     } catch (error: any) {
    //         res.status(500).send({
    //             ok: false,
    //             code: 500,
    //             message: "Erro interno do servidor"
    //         })
    //     }
    // }
}

export default AuthController