class ItemCarrinho {
    constructor(produto, quantidade) {
        this.produto = produto;
        this.quantidade = quantidade;
    }

    aumentarQuantidade() {
        this.quantidade++;
    }

    diminuirQuantidade() {
        if (this.quantidade <= 1) {
            return;
        }

        this.quantidade--;
    }
}

export default ItemCarrinho;