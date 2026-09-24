const PedidoService = require("../services/PedidoService");

// Teste unitario: o service e testado em isolamento total.
// O repository e substituido por um mock (jest.fn()), assim testamos so a
// logica do service, sem depender de dados reais.
//
// Abaixo ha 1 teste pronto (listar) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-03-PEDIDOS.md.

describe("PedidoService (unitario com mocks)", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    service = new PedidoService(mockRepository);
  });

  describe("listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const pedidos = [{ id: 1, cliente: "Ana Souza", itens: [], status: "pendente", total: 0 }];
      mockRepository.findAll.mockReturnValue(pedidos);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(pedidos);
    });
  });

  describe("buscarPorId", () => {
    test("repassa o id ao repository e retorna o pedido encontrado", () => {
      const pedido = { id: 1, cliente: "Ana Souza", itens: [], status: "pendente", total: 100 };
      mockRepository.findById.mockReturnValue(pedido);

      const resultado = service.buscarPorId(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(pedido);
    });

    test("lanca erro 'Pedido nao encontrado' quando o repository retorna null", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.buscarPorId(999)).toThrow("Pedido nao encontrado");
    });
  });

  describe("criar", () => {
    test("repassa os dados ao repository e retorna o pedido criado com o total calculado", () => {
      const novoPedido = {
        cliente: "Ana Souza",
        itens: [
          { nome: "Item A", preco: 10, quantidade: 2 },
          { nome: "Item B", preco: 30, quantidade: 1 },
        ],
      };

      const pedidoCriado = { id: 1, ...novoPedido, status: "pendente", total: 50 };
      mockRepository.create.mockReturnValue(pedidoCriado);

      const resultado = service.criar(novoPedido);

      expect(mockRepository.create).toHaveBeenCalledWith(novoPedido);
      expect(resultado).toEqual(pedidoCriado);
    });

    test("propaga o erro quando o cliente estiver faltando", () => {
      const dadosSemCliente = { itens: [{ nome: "Item A", preco: 10, quantidade: 1 }] };

      mockRepository.create.mockImplementation(() => {
        throw new Error("Cliente é obrigatório");
      });

      expect(() => service.criar(dadosSemCliente)).toThrow("Cliente é obrigatório");
    });

    test("propaga o erro quando a lista de itens estiver vazia", () => {
      const dadosSemItens = { cliente: "Ana Souza", itens: [] };

      mockRepository.create.mockImplementation(() => {
        throw new Error("A lista de itens nao pode estar vazia");
      });

      expect(() => service.criar(dadosSemItens)).toThrow("A lista de itens nao pode estar vazia");
    });

    test("propaga o erro quando algum item tiver preco ou quantidade invalidos", () => {
      const dadosItemInvalido = {
        cliente: "Ana Souza",
        itens: [{ nome: "Item A", preco: -10, quantidade: 0 }],
      };

      mockRepository.create.mockImplementation(() => {
        throw new Error("Preço e quantidade do item devem ser maiores que zero");
      });

      expect(() => service.criar(dadosItemInvalido)).toThrow("Preço e quantidade do item devem ser maiores que zero");
    });
  });

  describe("atualizarStatus", () => {
    test("chama repository.findById e repository.updateStatus quando o pedido existe", () => {
      const pedidoExistente = { id: 1, cliente: "Ana Souza", status: "pendente" };
      const pedidoAtualizado = { ...pedidoExistente, status: "entregue" };

      mockRepository.findById.mockReturnValue(pedidoExistente);
      mockRepository.updateStatus.mockReturnValue(pedidoAtualizado);

      const resultado = service.atualizarStatus(1, "entregue");

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(1, "entregue");
      expect(resultado).toEqual(pedidoAtualizado);
    });

    test("lanca erro 'Pedido nao encontrado' sem chamar repository.updateStatus quando o pedido nao existe", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.atualizarStatus(999, "entregue")).toThrow("Pedido nao encontrado");
      expect(mockRepository.updateStatus).not.toHaveBeenCalled();
    });

    test("propaga o erro quando o novo status for invalido", () => {
      const pedidoExistente = { id: 1, cliente: "Ana Souza", status: "pendente" };
      mockRepository.findById.mockReturnValue(pedidoExistente);

      mockRepository.updateStatus.mockImplementation(() => {
        throw new Error("Status inválido");
      });

      expect(() => service.atualizarStatus(1, "status_invalido")).toThrow("Status inválido");
    });

    test("propaga o erro quando o pedido ja estiver cancelado", () => {
      const pedidoCancelado = { id: 1, cliente: "Ana Souza", status: "cancelado" };
      mockRepository.findById.mockReturnValue(pedidoCancelado);

      mockRepository.updateStatus.mockImplementation(() => {
        throw new Error("Nao é possível alterar status de um pedido cancelado");
      });

      expect(() => service.atualizarStatus(1, "entregue")).toThrow("Nao é possível alterar status de um pedido cancelado");
    });
  });

  describe("remover", () => {
    test("chama repository.delete com o id correto quando o pedido existe", () => {
      mockRepository.delete.mockReturnValue(true);

      service.remover(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    test("lanca erro 'Pedido nao encontrado' quando o repository retorna false", () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remover(999)).toThrow("Pedido nao encontrado");
    });
  });
});
