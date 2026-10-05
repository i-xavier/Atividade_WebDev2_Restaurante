// Importa as classes de modelo, necessárias para recriar os objetos lidos do localStorage.
import ItemCarrinho from "../script/itemCarrinho.js";
import Carrinho from "../script/carrinho.js";
import Pedido from "../script/pedido.js";

// Classe Repositorio: única porta de acesso aos dados (usada por index.js, cardapio.js e cart.js).
class Repositorio {

    // Ao criar o repositório, carrega do localStorage as listas salvas anteriormente.
    // O JSON não guarda métodos; por isso pedidos e carrinhos são reconvertidos em instâncias de Pedido, Carrinho e ItemCarrinho.
    constructor() {
        // ---------------------------------------------------------
        // PRODUTOS
        // ---------------------------------------------------------

        // Lista de produtos do cardápio: [{ id, produto }].
        this.produtos =
            JSON.parse(localStorage.getItem("produtos")) || [];


    
        // ---------------------------------------------------------
        // PEDIDOS
        // ---------------------------------------------------------

        // Lê os pedidos salvos e recria cada um como Pedido, restaurando status e data originais.
        const dadosPedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

        this.pedidos = dadosPedidos.map(elemento => {
            const obj = elemento.pedido;
            const pedidoRestaurado = new Pedido(obj.cliente, obj.itens, obj.tipoEntrega, obj.total);

            // Restaura o status e a data originais
            if (obj.status) pedidoRestaurado.status = obj.status;
            if (obj.data) pedidoRestaurado.data = obj.data;

            return {
                id: elemento.id,
                pedido: pedidoRestaurado
            };
        });


        // ---------------------------------------------------------
        // CARRINHO
        // ---------------------------------------------------------

        // Lê os carrinhos salvos e recria cada um como Carrinho com seus ItemCarrinho e o status (aberto/fechado).
        const dadosCarrinho =
            JSON.parse(localStorage.getItem("carrinho")) || [];

        this.carrinho = dadosCarrinho.map(elemento => {

            const itens = elemento.carrinho.itens.map(item => {
                return new ItemCarrinho(
                    item.produto,
                    item.quantidade
                );
            });

            return {
                id: elemento.id,

                carrinho: new Carrinho(
                    itens,
                    elemento.carrinho.status
                )
            };
        });
    }


    // =============================================================
    // MÉTODOS GERAIS
    // =============================================================

    // Gera o próximo id de uma lista: maior id já salvo + 1 (ou 1 se a lista estiver vazia).
    // nomeLista é a chave usada no localStorage ("produtos", "carrinho", "pedidos"...).
    gerarId(nomeLista) {

        const dadosSalvos = localStorage.getItem(nomeLista);

        if (!dadosSalvos) {
            return 1;
        }

        const lista = JSON.parse(dadosSalvos);

        if (!Array.isArray(lista) || lista.length === 0) {
            return 1;
        }

        const maiorId = Math.max(
            ...lista.map(item => item.id)
        );

        return maiorId + 1;
    }

    // =============================================================
    // PRODUTOS
    // =============================================================

    // CREATE de produto: cria o registro { id, produto }, adiciona na lista
    // e salva no localStorage [BÔNUS].
    adicionarProduto(produto) {

        const novoRegistro = {
            id: this.gerarId("produtos"),
            produto: produto
        };

        this.produtos.push(novoRegistro);

        localStorage.setItem(
            "produtos",
            JSON.stringify(this.produtos)
        );
    }


    //  DELETE de produto: remove da lista o produto com o id informado e salva.
    apagarProduto(id) {

        this.produtos =
            this.produtos.filter(item => item.id !== id);

        localStorage.setItem(
            "produtos",
            JSON.stringify(this.produtos)
        );
    }


    //  UPDATE de produto: copia os dados novos para o produto com o id informado e salva.
    // Retorna true se achou o produto e false se não existe.
    alterarProduto(id, dadosAlterados) {

        const registro =
            this.produtos.find(produto => produto.id === id);

        if (!registro) {
            return false;
        }

        Object.assign(
            registro.produto,
            dadosAlterados
        );

        localStorage.setItem(
            "produtos",
            JSON.stringify(this.produtos)
        );

        return true;
    }


    //  READ de um produto: devolve o registro { id, produto } com o id informado ou null.
    buscarProduto(id) {

        return this.produtos.find(
            elemento => elemento.id === id
        ) || null;
    }


    //  READ de todos os produtos (usado para listar o cardápio e montar o carrossel).
    getProdutos() {

        return this.produtos;
    }


    // Descobre o id de um produto comparando o próprio objeto (mesma referência).
    // Usado logo após o cadastro para criar o card do produto na tela.
    getProdutoId(produto) {

        const registro =
            this.produtos.find(
                elemento => elemento.produto === produto
            );

        return registro ? registro.id : null;
    }


    // =============================================================
    // CARRINHO
    // =============================================================

    // [CARRINHO] Procura, entre os carrinhos salvos, o que está aberto (status true).
    /**
     * Retorna o registro do carrinho que está aberto.
     *
     * Retorno:
     *
     * {
     *     id: 1,
     *     carrinho: Carrinho
     * }
     *
     * ou null caso não exista carrinho aberto.
     */
    buscarCarrinhoAberto() {

        return this.carrinho.find(
            registro => registro.carrinho.estaAberto()
        ) || null;
    }


    // Auxiliar: informa (true/false) se existe algum carrinho aberto.
    /**
     * Verifica se existe algum carrinho aberto.
     */
    validarCarrinho() {

        return this.carrinho.some(
            registro => registro.carrinho.estaAberto()
        );
    }


    //  CREATE no carrinho: "Adicionar produtos ao carrinho" a partir do cardápio ou do carrossel.
    // Se já há carrinho aberto, o item entra nele; senão cria um carrinho novo (aberto) com o item.
    // Depois recalcula o subtotal e salva [BÔNUS].
    /**
     * Adiciona um produto ao carrinho aberto.
     *
     * Se não existir carrinho aberto,
     * cria um novo.
     */
    abrirCarrinho(produto) {

        const registro =
            this.buscarCarrinhoAberto();


        // ---------------------------------------------------------
        // JÁ EXISTE CARRINHO ABERTO
        // ---------------------------------------------------------

        if (registro) {

            registro.carrinho.adicionarItem(produto);

            registro.carrinho.calcularSubtotal();

            this.salvarCarrinho();

            return true;
        }


        // ---------------------------------------------------------
        // NÃO EXISTE CARRINHO ABERTO
        // ---------------------------------------------------------

        const novoCarrinho =
            new Carrinho([], true);

        novoCarrinho.adicionarItem(produto);

        novoCarrinho.calcularSubtotal();


        this.carrinho.push({

            id: this.gerarId("carrinho"),

            carrinho: novoCarrinho

        });


        this.salvarCarrinho();

        return true;
    }


    //  Devolve todos os registros de carrinho salvos.
    /**
     * Retorna todos os carrinhos armazenados.
     */
    getCarrinho() {

        return this.carrinho;
    }


    //  Devolve o objeto Carrinho aberto (ou null se não houver).
    /**
     * Retorna o carrinho atualmente aberto.
     *
     * Diferente de getCarrinho(), que retorna
     * todos os registros.
     */
    getCarrinhoAberto() {

        const registro =
            this.buscarCarrinhoAberto();

        if (!registro) {
            return null;
        }

        return registro.carrinho;
    }


    //  Devolve os itens do carrinho aberto, para exibir o conteúdo do carrinho.
    /**
     * Retorna os itens do carrinho aberto.
     *
     * Agora não existe mais getItensCarrinho()
     * separado.
     */
    getItensCarrinho() {

        const carrinho =
            this.getCarrinhoAberto();

        if (!carrinho) {
            return [];
        }

        return carrinho.getItensCarrinho();
    }

    // [CARRINHO] Devolve o subtotal do carrinho aberto.
    // Se não houver carrinho aberto, devolve um array vazio.
    getSubtotal() {

        const carrinho =
            this.getCarrinhoAberto();

        if (!carrinho) {
            return [];
        }

        return carrinho.getSubtotal();
    }


    //  Devolve o item que está na posição indicada do carrinho aberto (ou null).
    /**
     * Retorna um ItemCarrinho pelo índice.
     *
     * Por enquanto usamos índice porque
     * ItemCarrinho não possui ID próprio.
     */
    getItemCarrinho(indice) {

        const itens =
            this.getItensCarrinho();

        if (indice < 0 || indice >= itens.length) {
            return null;
        }

        return itens[indice];
    }


    //  Devolve a quantidade do item da posição indicada (ou null).
    /**
     * Retorna a quantidade de determinado item.
     */
    getQuantidadeItem(indice) {

        const item =
            this.getItemCarrinho(indice);

        if (!item) {
            return null;
        }

        return item.quantidade;
    }


    // Na prática devolve a posição (índice) do último item do carrinho, ou null se estiver vazio.
    /**
     * Retorna a quantidade de itens no carrinho.
     */
    getUltimoId() {

        const itens =
            this.getItensCarrinho();

        if (itens.length === 0) {
            return null;
        }

        return itens.length - 1;
    }


    //  DELETE no carrinho: "Remover itens individualmente".
    // Confere se há carrinho aberto e se a posição é válida, remove o item da lista,
    // recalcula o subtotal e salva.
    /**
     * Remove um item do carrinho pelo índice.
     */
    apagarItemCarrinho(indice) {

        const carrinho =
            this.getCarrinhoAberto();

        if (!carrinho) {
            return false;
        }

        if (
            indice < 0 ||
            indice >= carrinho.itens.length
        ) {
            return false;
        }

        // Refaz a lista de itens com filter(), mantendo só os elementos que satisfazem a condição.
        carrinho.itens = carrinho.itens.filter(i => i !== indice);

        carrinho.calcularSubtotal();

        this.salvarCarrinho();

        return true;
    }


    //  UPDATE no carrinho: aumenta a quantidade do item (botão +), recalcula o subtotal e salva.
    /**
     * Aumenta a quantidade de um item.
     */
    aumentarQuantidadeItem(indice) {

        const item =
            this.getItemCarrinho(indice);

        if (!item) {
            return false;
        }

        item.aumentarQuantidade();

        const carrinho =
            this.getCarrinhoAberto();

        carrinho.calcularSubtotal();

        this.salvarCarrinho();

        return true;
    }


    //  UPDATE no carrinho: diminui a quantidade do item (botão -, mínimo 1), recalcula o subtotal e salva.
    /**
     * Diminui a quantidade de um item.
     */
    diminuirQuantidadeItem(indice) {

        const item =
            this.getItemCarrinho(indice);

        if (!item) {
            return false;
        }

        item.diminuirQuantidade();

        const carrinho =
            this.getCarrinhoAberto();

        carrinho.calcularSubtotal();

        this.salvarCarrinho();

        return true;
    }


    //  Substitui a lista de itens do carrinho aberto, recalcula o subtotal e salva.
    /**
     * Substitui os itens do carrinho aberto.
     */
    alterarCarrinho(dadosAlterados) {

        const registro =
            this.buscarCarrinhoAberto();

        if (!registro) {
            return false;
        }

        registro.carrinho.itens =
            dadosAlterados;

        registro.carrinho.calcularSubtotal();

        this.salvarCarrinho();

        return true;
    }


    // Grava todos os carrinhos no localStorage (chamado após cada alteração).
    /**
     * Salva o estado atual dos carrinhos.
     */
    salvarCarrinho() {

        localStorage.setItem(
            "carrinho",
            JSON.stringify(this.carrinho)
        );
    }


    // Devolve o maior id entre os registros de carrinho (ou null se não houver).
    /**
     * Retorna o ID do último registro de carrinho.
     */
    getUltimoIdCarrinho() {

        if (this.carrinho.length === 0) {
            return null;
        }

        return Math.max(
            ...this.carrinho.map(
                item => item.id
            )
        );
    }

    // Procura o item informado na lista do carrinho aberto (comparação por referência)
    // e devolve o resultado do find(). Usado em cart.js ao excluir um item.
    buscarIndiceItem(item) {

        const listaItens = this.getItensCarrinho();

        return listaItens.find(i => i === item);
    }


    // =============================================================
    // PEDIDOS
    // =============================================================

    abrirPedido(cliente, tipoEntrega) {

        const registroCarrinho = this.buscarCarrinhoAberto();
        const registroPedido = this.buscarPedidoAberto();
        const itens = registroCarrinho.carrinho.getItensCarrinho();

        const subtotal = registroCarrinho.carrinho.getSubtotal();

        // ---------------------------------------------------------
        // JÁ EXISTE CARRINHO ABERTO
        // ---------------------------------------------------------

        // Caso 1: já existe pedido aberto -> recalcula o total e atualiza itens, cliente e tipo de entrega.
        if (registroPedido && registroCarrinho) {

            console.log("pedido e carrinho estão abertos");

            const total = this.calcularTotal(tipoEntrega);

            console.log("total: " + total);

            registroPedido.pedido.setItens(itens);
            registroPedido.pedido.setTotal(total);

            if (!cliente) {
                registroPedido.pedido.setCliente(cliente);
            }

            if (!tipoEntrega) {
                registroPedido.pedido.setTipoEntrega(tipoEntrega);
            }

            this.salvarPedido();

            return true;
        }


        // ---------------------------------------------------------
        // NÃO EXISTE CARRINHO ABERTO
        // ---------------------------------------------------------

        console.log("não existe pedido aberto");

        // Caso 2: não existe pedido aberto -> cria um novo Pedido (status "Pendente") com o subtotal como total inicial.
        const novoPedido =
            new Pedido(cliente, itens, tipoEntrega, subtotal);

        /*novoPedido.setItens(itens);
        novoPedido.setCliente(cliente);
        novoPedido.setTotal(total);
        novoPedido.setTipoEntrega(tipoEntrega);*/

        this.pedidos.push({

            id: this.gerarId("pedidos"),

            pedido: novoPedido

        });


        this.salvarPedido();

        return true;
    }

    //  Devolve o total do pedido aberto.
    getTotal() {

        const registroPedido = this.buscarPedidoAberto();

        return registroPedido.pedido.getTotal();
    }

    //  Devolve o nome do cliente do pedido aberto.
    getCliente() {

        const registroPedido = this.buscarPedidoAberto();

        return registroPedido.pedido.getCliente();
    }

    // Calcula o total (subtotal + taxa de entrega) usando o Carrinho aberto,
    // grava o valor no pedido aberto e salva pedido e carrinho.
    // O parâmetro recebe o TIPO de entrega, que define se há taxa.
    calcularTotal(taxa) {

        const registroPedido = this.buscarPedidoAberto();

        const registroCarrinho = this.buscarCarrinhoAberto();

        const total = registroCarrinho.carrinho.calcularTotal(taxa);

        console.log("22" + total);

        registroPedido.pedido.setTotal(total);

        this.salvarPedido();
        this.salvarCarrinho();

        return total;
    }

    // Grava todos os pedidos no localStorage.
    salvarPedido() {
        localStorage.setItem("pedidos", JSON.stringify(this.pedidos))
    }

    // Devolve o pedido em andamento (status diferente de "Finalizado") ou null.
    buscarPedidoAberto() {

        return this.pedidos.find(
            registro => registro.pedido.estaAberto()
        ) || null;

    }

    // Define o tipo de entrega do pedido aberto.
    setTipoEntrega(tipoEntrega) {
        const pedido = this.buscarPedidoAberto();

        pedido.pedido.setTipoEntrega(tipoEntrega);
    }

    // Devolve o tipo de entrega do pedido aberto (sem retorno quando não há pedido aberto).
    getTipoEntrega() {
        const pedido = this.buscarPedidoAberto();

        if (pedido !== null) {
            return pedido.pedido.tipoEntrega;
        }

    }
    
    //  Busca um pedido pelo id (devolve o registro ou null).
    buscarPedido(id) {

        return this.pedidos.find(
            elemento => elemento.id === id
        ) || null;
    }


    //  Devolve todos os pedidos salvos.
    getPedidos() {

        return this.pedidos;
    }

    //  Limpar o carrinho: apaga os registros de carrinho e grava a lista vazia no localStorage.
    // Usado pelo botão "Limpar Carrinho" e após finalizar o pedido.
    limparCarrinhoAberto() {
        this.carrinho = []; // Apaga todos os registros de carrinho
        this.salvarCarrinho(); // Salva o array vazio no localStorage
    }

}


// Exporta a classe para ser usada nas páginas (index.js, cardapio.js e cart.js).
export default Repositorio;