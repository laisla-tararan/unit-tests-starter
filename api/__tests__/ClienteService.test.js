const ClienteService = require("../services/ClienteService");

// Teste unitario: o service e testado em isolamento total.
// O repository e substituido por um mock (jest.fn()), assim testamos so a
// logica do service, sem depender de dados reais.
//
// Abaixo ha 1 teste pronto (listar) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-02-CLIENTES.md.

describe("ClienteService (unitario com mocks)", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new ClienteService(mockRepository);
  });

  describe("listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const clientes = [{ id: 1, nome: "Ana Souza", email: "ana@email.com" }];
      mockRepository.findAll.mockReturnValue(clientes);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(clientes);
    });
  });

describe("buscarPorId", () => {
  test("repassa o id ao repository e retorna o cliente encontrado", () => {
    const cliente = { id: 1, nome: "Ana Souza", email: "ana@email.com" };
    mockRepository.findById.mockReturnValue(cliente);

    const resultado = service.buscarPorId(1);

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(resultado).toEqual(cliente);
  });

  test("lanca erro 'Cliente nao encontrado' quando o repository retorna null", () => {
    mockRepository.findById.mockReturnValue(null);

    expect(() => service.buscarPorId(999)).toThrow("Cliente nao encontrado");
  });
});

  describe("criar", () => {
    test("repassa os dados ao repository e retorna o cliente criado", () => {
      const dadosNovoCliente = { nome: 'Beatriz', email: 'beatriz@email.com' }
        const clienteCriado = { id: 1, ...dadosNovoCliente }
        mockRepository.create.mockReturnValue(clienteCriado)
            
        const resultado = service.criar(dadosNovoCliente)
        
        expect(mockRepository.create).toHaveBeenCalledWith(dadosNovoCliente)
        expect(resultado).toEqual(clienteCriado)
    });
    test("propaga o erro quando nome ou email estiverem faltando", () => {
      const dadosSemNome = { email: 'beatriz@gmail.com'}
      const dadosSemEmail = { nome: 'Beatriz' }

      expect(() => service.criar(dadosSemNome)).toThrow('Nome e email são obrigatórios')
      expect(() => service.criar(dadosSemEmail)).toThrow('Nome e email são obrigatórios')
    });
    test("deve lançar erro quando o e-mail já estiver cadastrado", () => {
      const clienteExistente = { nome: "Ana Souza", email: "ana@email.com" };

      // Simula que o repositório já encontrou o e-mail no banco
      mockRepository.findByEmail.mockReturnValue(clienteExistente);

      expect(() => service.criar(clienteExistente)).toThrow("E-mail já cadastrado");
    });
  });

  describe("atualizar", () => {
    test("deve chamar mockRepository.findById e depois mockRepository.update quando o cliente existe", () => {
      const clienteExistente = { id: 1, nome: "Ana Souza", email: "ana@email.com" };
      const dadosAtualizacao = { nome: "Ana Silva", email: "ana.silva@email.com" };

      mockRepository.findById.mockReturnValue(clienteExistente);

      service.atualizar(1, dadosAtualizacao);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, dadosAtualizacao);
    });

    test("deve lançar erro 'Cliente nao encontrado' sem chamar mockRepository.update quando findById retornar null", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.atualizar(999, { nome: "Novo Nome" })).toThrow("Cliente nao encontrado");
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    test("deve propagar o erro quando o novo e-mail já pertencer a outro cliente", () => {
      const clienteExistente = { id: 1, nome: "Ana Souza", email: "ana@email.com" };
      const outroClienteComMesmoEmail = { id: 2, nome: "Carlos", email: "novo@email.com" };
      const dadosAtualizacao = { nome: "Ana Souza", email: "novo@email.com" };

      mockRepository.findById.mockReturnValue(clienteExistente);
      // Simula a busca prévia por e-mail encontrando outro usuário
      mockRepository.findByEmail.mockReturnValue(outroClienteComMesmoEmail);

      expect(() => service.atualizar(1, dadosAtualizacao)).toThrow("E-mail já cadastrado");
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("remover", () => {
    test("chama repository.delete com o id correto quando o cliente existe", () => {
      mockRepository.delete.mockReturnValue(true);

      service.remover(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    test("lanca erro 'Cliente nao encontrado' quando o repository retorna false", () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remover(999)).toThrow("Cliente nao encontrado");
    });
  });
});
