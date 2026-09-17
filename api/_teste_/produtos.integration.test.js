const request = require('supertest')
const createApp = require('../app')

describe('API /produtos - testes de integração', () => {
    let app

    beforeEach(() => {
        app = createApp()
    })

    describe('GET /produtos', () => {
        test('retorna 200 e um array com os produtos iniciais', async () => {
            const res = await request(app).get('/produtos')

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(3)
        })        
    })
    describe('GET /produtos/:id', () => {
        test('deve retornar 200 e o produto correspondente ao id', async () => {
            const res = await request(app).get('/produtos/1') 

            expect(res.status).toBe(200) 
            expect(res.body).toHaveProperty('id', 1) 
        }) 

        test('deve retornar 404 quando o produto não for encontrado', async () => {
            const res = await request(app).get('/produtos/999') 

            expect(res.status).toBe(404) 
            expect(res.body).toHaveProperty('erro') 
        }) 
    }) 
    describe('POST /produtos', () => {
        test('deve retornar 201 e o produto criado com id gerado', async () => {
            const novo = { nome: 'Suco', preco: 6 }
            const res = await request(app)
                .post('/produtos')
                .send(novo)

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('id')
            expect(res.body.nome).toBe('Suco')
            expect(res.body.preco).toBe(6)
        })

        test('deve retornar 400 com { erro: ... } quando o nome estiver faltando', async () => {
            const res = await request(app)
            .post('/produtos')
            .send({ preco: 6 }) 

            expect(res.status).toBe(400) 
            expect(res.body).toHaveProperty('erro') 
        })

        test('deve retornar 400 com { erro: ... } quando o preco estiver faltando', async () => {
            const res = await request(app)
            .post('/produtos')
            .send({ nome: 'Suco' }) 

            expect(res.status).toBe(400) 
            expect(res.body).toHaveProperty('erro') 
        })

        test('o produto criado deve aparecer em uma chamada seguinte a GET /produtos', async () => {
            const novo = { nome: 'Empada', preco: 7 } 
            const resPost = await request(app).post('/produtos').send(novo) 
            const idCriado = resPost.body.id 

            const resGet = await request(app).get('/produtos') 
            expect(resGet.status).toBe(200) 

            const ids = resGet.body.map(produto => produto.id) 
            expect(ids).toContain(idCriado) 
        })
    })

    describe('DELETE /produtos/:id', () => {
        test('deve retornar 204 quando o produto é removido com sucesso', async () => {
            const res = await request(app).delete('/produtos/1') 
            expect(res.status).toBe(204) 
        }) 

        test('o produto removido não deve mais aparecer em GET /produtos/:id (deve retornar 404)', async () => {
            await request(app).delete('/produtos/1') 

            const resGet = await request(app).get('/produtos/1') 
            expect(resGet.status).toBe(404) 
        }) 

        test('deve retornar 404 com { erro: ... } quando o produto não existir', async () => {
            const res = await request(app).delete('/produtos/999') 
            expect(res.status).toBe(404) 
            expect(res.body).toHaveProperty('erro') 
        }) 
    })
})