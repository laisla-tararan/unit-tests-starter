class PedidoController {
  constructor(service) {
    this.service = service;
  }

  listar(req, res) {
    const pedidos = this.service.listar();
    res.json(pedidos);
  }

  buscarPorId(req, res) {
    try {
      const pedido = this.service.buscarPorId(req.params.id);
      res.json(pedido);
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  }

  criar(req, res) {
    try {
      const pedido = this.service.criar(req.body);
      res.status(201).json(pedido);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  // Exemplo no PedidoController.js
  atualizarStatus(req, res) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      const pedido = this.service.atualizarStatus(id, status);
      return res.status(200).json(pedido);
    } catch (err) {
      // Captura variações da mensagem de erro e retorna 404
      if (err.message.includes("encontrado")) {
        return res.status(404).json({ erro: err.message });
      }
      return res.status(400).json({ erro: err.message });
    }
  }

  remover(req, res) {
    try {
      this.service.remover(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  }
}

module.exports = PedidoController;
