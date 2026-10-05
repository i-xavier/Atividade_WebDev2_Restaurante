// carrinho.js: [POO] classe que agrupa os itens (ItemCarrinho) e calcula subtotal,
// taxa de entrega e total [CARRINHO] [TAXA].
// Rótulos usados nos comentários (critérios do enunciado de Desenvolvimento Web 2): [POO] [CRUD-C/R/U/D] [CARRINHO] [TAXA] [CARROSSEL] [IHC] [BÔNUS]
//
// Importa ItemCarrinho, usado para criar cada item adicionado.
import ItemCarrinho from "./itemCarrinho.js";
// [POO] Classe Carrinho: lista de itens + status (aberto/fechado) + valores calculados.
class Carrinho {

    // itens: lista de ItemCarrinho. status: true = carrinho aberto, false = fechado.
    // Também guarda o subtotal e a taxa de entrega (começa em 0).
    constructor(itens, status) {
        this.itens = itens;
        this.status = status;
        // Campo do subtotal; o valor numérico é preenchido em calcularSubtotal().
        this.subtotal = this.getSubtotal;
        this.taxaEntrega = 0;
    }

    // [CRUD-C] Adiciona um produto ao carrinho como novo item com quantidade 1.
    adicionarItem(produto) {
        const item = new ItemCarrinho(produto, 1);
        this.itens.push(item);
    }

    // Retorna true se o carrinho está aberto (é o carrinho em uso pelo cliente).
    estaAberto() {
        return this.status === true;
    }

    // Marca o carrinho como fechado (usado depois de finalizar o pedido).
    fecharCarrinho() {
        this.status = false;
    }

    // [CARRINHO] Soma preço x quantidade de todos os itens e guarda o resultado
    // com 2 casas decimais (toFixed) pelo setSubtotal().
    calcularSubtotal() {
        let total = 0;

        this.itens.forEach(item => {
            total +=
                parseFloat(item.produto.preco) *
                parseFloat(item.quantidade);
        });

        this.setSubtotal(total.toFixed(2));
    }

    // [TAXA] Regra do enunciado: R$ 2,50 fixos por entrega quando o pedido é delivery
    // e contém marmita. Retirada ou consumo no local não pagam taxa.
    // O resultado fica em this.taxaEntrega.
    calcularTaxaEntrega(tipoEntrega) {
        const listaCarrinho = this.getItensCarrinho();

        // Verifica se existe alguma marmita (ignorando maiúsculas/minúsculas para evitar bugs)
        // true se algum item do carrinho tem 'marmita' no nome.
        const temMarmita = listaCarrinho.some(e =>
            e.produto.nome.toLowerCase().includes("marmita")
        );

        // O requisito pede uma taxa fixa por entrega, não por quantidade
        // Taxa fixa só quando as duas condições são verdadeiras; caso contrário, 0.
        if (tipoEntrega === "delivery" && temMarmita) {
            this.taxaEntrega = 2.50;
        } else {
            this.taxaEntrega = 0;
        }
    }

    // Total do pedido = subtotal + taxa de entrega.
    calcularTotal(tipoEntrega) {
        this.calcularSubtotal();
        this.calcularTaxaEntrega(tipoEntrega);

        const subtotal = this.getSubtotal();
        const taxa = this.getTaxaEntrega();

        return parseFloat(subtotal) + parseFloat(taxa);
    }

    // Devolve a lista de itens (usada para exibir o carrinho).
    getItensCarrinho() {
        return this.itens;
    }

    // Recalcula e devolve o subtotal atual.
    getSubtotal() {
        this.calcularSubtotal()

        return this.subtotal;
    }

    // Setter: guarda o subtotal calculado.
    setSubtotal(subtotal) {
        this.subtotal = subtotal;
    }

    // Devolve a taxa de entrega calculada por calcularTaxaEntrega().
    getTaxaEntrega() {
        return this.taxaEntrega;
    }
}

// Exporta a classe para ser usada em repositorio.js.
export default Carrinho;