class ProdutoService {
  constructor(repository) {
    this.repository = repository;
  }

  listar() {
    return this.repository.findAll();
  }

  buscarPorId(id) {
    const produto = this.repository.findById(id);
    return produto;
  }

  criar(dados) {
    return this.repository.create(dados);
  }

  remover(id) {
    const removido = this.repository.delete(id);
    if (!removido) throw new Error('Produto não encontrado');
  }
}

module.exports = ProdutoService;
