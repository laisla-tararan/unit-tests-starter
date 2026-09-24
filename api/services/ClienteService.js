class ClienteService {
  constructor(repository) {
    this.repository = repository;
  }

  listar() {
    return this.repository.findAll();
  }

  buscarPorId(id) {
    const cliente = this.repository.findById(id);
    if (!cliente) throw new Error("Cliente nao encontrado");
    return cliente;
  }

  criar(dados) {
    if (!dados?.nome || !dados?.email) {
      throw new Error("Nome e email são obrigatórios");
    }

    const clienteExistente = this.repository.findByEmail(dados.email);
    if (clienteExistente) {
      throw new Error("E-mail já cadastrado");
    }

    return this.repository.create(dados);
  }

  atualizar(id, dados) {
  const clienteExistente = this.repository.findById(id);
  // Remova o acento nesta linha para satisfazer a expectativa do teste:
  if (!clienteExistente) throw new Error("Cliente nao encontrado");

  if (dados.email) {
    const outroCliente = this.repository.findByEmail(dados.email);
    if (outroCliente && outroCliente.id !== Number(id)) {
      throw new Error("E-mail já cadastrado");
    }
  }

  return this.repository.update(id, dados);
}

  remover(id) {
    const removido = this.repository.delete(id);
    if (!removido) throw new Error("Cliente nao encontrado");
  }
}

module.exports = ClienteService;
