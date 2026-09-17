const ProdutoService = require('../services/ProdutoService')

describe('ProdutoService - testes unitários', () => {
    let service;
    let mockRepository;

    beforeEach(() => {
        mockRepository = {
            findAll: jest.fn(), //É uma função que retorna undefined.
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn()
        }
        service = new ProdutoService(mockRepository) //Injeção de Dependência
    })
    describe('listar', () => {
        test('chama repository.findAll uma vez e retorna o resultado', () => {
            const produtos = [{id: 1, nome: 'Coxinha', preco: 5}]
            mockRepository.findAll.mockReturnValue(produtos)

            const resultado = service.listar()

            expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
            expect(resultado).toEqual(produtos)
        })
    })

    // TAREFA:  Teste com FindById
    describe('buscarPorId', () => {
        test('deve chamar mockRepository.findById com o id correto e retornar o produto', () => {
            const produto = { id: 1, nome: 'Coxinha', preco: 5 }
            mockRepository.findById.mockReturnValue(produto)

            const resultado = service.buscarPorId(1)

            expect(mockRepository.findById).toHaveBeenCalledWith(1)
            expect(resultado).toEqual(produto)
        })
        test('deve retornar null/undefined quando o produto não for encontrado', () => {
            mockRepository.findById.mockReturnValue(null)

            const resultado = service.buscarPorId(999)

            expect(mockRepository.findById).toHaveBeenCalledWith(999)
            expect(resultado).toBeNull()
        })
    })
    // Parte 1 — ProdutoService (unitario com mock)
    describe('criar', () => {
        test('deve repassar dados para mockRepository.create e retornar o produto criado', () => {
            const dadosNovoProduto = { nome: 'Pastel', preco: 8 }
            const produtoCriado = { id: 1, ...dadosNovoProduto }
            mockRepository.create.mockReturnValue(produtoCriado)

            const resultado = service.criar(dadosNovoProduto)

            expect(mockRepository.create).toHaveBeenCalledWith(dadosNovoProduto)
            expect(resultado).toEqual(produtoCriado)
        })

        test('deve propagar o erro lançado pelo repository quando os dados forem inválidos', () => {
            const dadosInvalidos = { preco: 8 }
            mockRepository.create.mockImplementation(() => {
                throw new Error('Dados inválidos')
            })

            expect(() => service.criar(dadosInvalidos)).toThrow('Dados inválidos')
        })
    })

    describe('remover', () => {
        test('deve chamar mockRepository.delete com o id correto quando o produto existe', () => {
            mockRepository.delete.mockReturnValue(true)

            expect(() => service.remover(1)).not.toThrow()
            expect(mockRepository.delete).toHaveBeenCalledWith(1)
        })

        test('deve lançar erro "Produto não encontrado" quando o repository retornar false', () => {
            mockRepository.delete.mockReturnValue(false)

            expect(() => service.remover(999)).toThrow('Produto não encontrado')
        })
    })
})