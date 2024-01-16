import { createServer } from '../../src/express.server'
import request from 'supertest'

describe('User Routes ', () => {
    const server = createServer()
    describe('List - GET', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).get("/users")


        })
        test('Deve retornar Autenticação do token falhou, quando for informado um token inválido', () => {

        })
    })
    describe('Register - POST', () => {
    })
    describe('Delete - GET', () => {
    })
    describe('Update - GET', () => {
    })
})