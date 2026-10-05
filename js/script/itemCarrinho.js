class ItemCarrinho {
    // Guarda o produto escolhido e a quantidade (o Carrinho cria o item com quantidade 1).
    constructor(produto, quantidade) {
        this.produto = produto;
        this.quantidade = quantidade;
    }

    // Aumenta em 1 a quantidade do item (botão + do carrinho).
    aumentarQuantidade() {
        this.quantidade++;
    }

    // Diminui em 1 a quantidade do item (botão - do carrinho).
    // Nunca passa de 1 para baixo: para tirar o item é preciso excluí-lo 
    diminuirQuantidade() {
        if (this.quantidade <= 1) {
            return;
        }

        this.quantidade--;
    }
}

// Exporta a classe para ser usada em carrinho.js e repositorio.js.
export default ItemCarrinho;