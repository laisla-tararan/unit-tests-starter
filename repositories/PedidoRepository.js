const STATUS_VALIDOS = ["pendente", "pago", "cancelado"];

class PedidoRepository {
  constructor() {
    this.pedidos = [
      {
        id: 1,
        cliente: "Ana Souza",
        itens: [{ nome: "Coxinha", precoUnitario: 5, quantidade: 2 }],
        status: "pendente",
        total: 10,
      },
    ];
    this.nextId = 2;
  }

  findAll() {
    return this.pedidos;
  }

  findById(id) {
    return this.pedidos.find(p => p.id === Number(id)) || null;
  }

  create(dados) {
    const total = dados.itens
      ? dados.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0)
      : 0;

    const novoPedido = {
      id: this.proximoId++,
      ...dados,
      status: dados.status || 'pendente',
      total
    };

    this.pedidos.push(novoPedido);
    return novoPedido;
  }

  updateStatus(id, novoStatus) {
    const pedido = this.findById(id);
    if (!pedido) return null;

    if (!STATUS_VALIDOS.includes(novoStatus)) {
      throw new Error("Status invalido");
    }
    if (pedido.status === "cancelado") {
      throw new Error("Pedido cancelado nao pode ser alterado");
    }

    pedido.status = novoStatus;
    return pedido;
  }

  delete(id) {
    const index = this.pedidos.findIndex((p) => p.id === Number(id));
    if (index === -1) return false;
    this.pedidos.splice(index, 1);
    return true;
  }
}

module.exports = PedidoRepository;
