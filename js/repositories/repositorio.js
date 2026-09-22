import ItemCarrinho from "../script/itemCarrinho.js";

class Repositorio {

    constructor() {
        // Carrega do localStorage ao instanciar ou inicia array vazio
        this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        this.produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        this.pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
        this.carrinhos = JSON.parse(localStorage.getItem("carrinhos")) || [];

        const dadosItensCarrinho =
            JSON.parse(localStorage.getItem("itensCarrinho")) || [];

        this.itensCarrinho = dadosItensCarrinho.map(elemento => {
            return {
                id: elemento.id,
                itemCarrinho: new ItemCarrinho(
                    elemento.itemCarrinho.produto,
                    elemento.itemCarrinho.quantidade
                )
            };
        });
    }

    gerarId(nomeLista) {
        const dadosSalvos = localStorage.getItem(nomeLista);

        if (!dadosSalvos) {
            return 1;
        }

        const lista = JSON.parse(dadosSalvos);

        if (!Array.isArray(lista) || lista.length === 0) {
            return 1;
        }

        // Descobre o maior ID atual e soma +1
        const maiorId = Math.max(...lista.map(item => item.id));
        return maiorId + 1;
    }

    // --- USUÁRIOS ---
    adicionarUsuario(usuario) {
        const novoRegistro = {
            id: this.gerarId("usuarios"),
            usuario: usuario
        };

        this.usuarios.push(novoRegistro);
        localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
    }

    apagarUsuario(id) {
        this.usuarios = this.usuarios.filter(user => user.id !== id);
        localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
    }

    alterarUsuario(id, dadosAlterados) {
        this.usuarios.forEach(usuario => {
            if (usuario.id === id) {
                usuario.usuario = dadosAlterados;
            }
        });
        localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
    }

    buscarUsuario(id) {
        return this.usuarios.find(elemento => elemento.id === id) || null;
    }

    getUsuarios() {
        return this.usuarios;
    }

    // --- PRODUTOS ---
    adicionarProduto(produto) {
        const novoRegistro = {
            id: this.gerarId("produtos"),
            produto: produto
        };

        this.produtos.push(novoRegistro);
        localStorage.setItem("produtos", JSON.stringify(this.produtos));
    }

    apagarProduto(id) {
        this.produtos = this.produtos.filter(item => item.id !== id);
        localStorage.setItem("produtos", JSON.stringify(this.produtos));
    }

    alterarProduto(id, dadosAlterados) {

        const registro = this.produtos.find(produto => produto.id === id);

        if (!registro) {
            return false;
        }

        Object.assign(registro.produto, dadosAlterados);

        localStorage.setItem("produtos", JSON.stringify(this.produtos));

        return true;
    }

    buscarProduto(id) {

        /*if (id === -1) {

        }*/

        return this.produtos.find(elemento => elemento.id === id) || null;
    }

    getProdutos() {
        return this.produtos;
    }

    getProdutoId(produto) {
        const registro = this.produtos.find(elemento => elemento.produto === produto);

        return registro ? registro.id : null;
    }

    // --- PEDIDOS ---
    adicionarPedido(pedido) {
        const novoRegistro = {
            id: this.gerarId("pedidos"),
            pedido: pedido
        };

        this.pedidos.push(novoRegistro);
        localStorage.setItem("pedidos", JSON.stringify(this.pedidos));
    }

    apagarPedido(id) {
        this.pedidos = this.pedidos.filter(pedido => pedido.id !== id);
        localStorage.setItem("pedidos", JSON.stringify(this.pedidos));
    }

    alterarPedido(id, dadosAlterados) {
        this.pedidos.forEach(pedido => {
            if (pedido.id === id) {
                pedido.pedido = dadosAlterados;
            }
        });
        localStorage.setItem("pedidos", JSON.stringify(this.pedidos));
    }

    buscarPedido(id) {
        return this.pedidos.find(elemento => elemento.id === id) || null;
    }

    getPedidos() {
        return this.pedidos;
    }

    // --- ITEM CARRINHO ---
    adicionarItemCarrinho(id) {
        const produto = this.buscarProduto(id);

        const novoRegistro = {
            id: this.gerarId("itensCarrinho"),
            itemCarrinho: new ItemCarrinho(
                produto.produto,
                1
            )
        };

        this.itensCarrinho.push(novoRegistro);

        this.salvarItensCarrinho();
    }

    getItensCarrinho() {

        return this.itensCarrinho;
    }

    getItemCarrinho(id) {
        const registro = this.itensCarrinho.find(
            elemento => elemento.id === id
        );

        if (registro) {
            return registro.itemCarrinho;
        }

        return null;
    }

    getQuantidadeItem(id) {

        let qtd = 0;

        this.itensCarrinho.find(elemento => {
            if (elemento.id === id) {
                qtd = elemento.itemCarrinho.quantidade;
            }
        })


        if (qtd !== 0) {
            return qtd;
        }
        else
            return null;

    }

    getUltimoId() {

        return Math.max(...this.itensCarrinho.map(item => item.id));

    }

    apagarItemCarrinho(id) {
        this.itensCarrinho = this.itensCarrinho.filter(item => item.id !== id);
        localStorage.setItem("itensCarrinho", JSON.stringify(this.itensCarrinho));
    }

    salvarItensCarrinho() {
        localStorage.setItem(
            "itensCarrinho",
            JSON.stringify(this.itensCarrinho)
        );
    }

    aumentarQuantidadeItem(id) {
        const item = this.getItemCarrinho(id);

        if (item) {
            item.aumentarQuantidade();
            this.salvarItensCarrinho();
        }
    }

    diminuirQuantidadeItem(id) {
        const item = this.getItemCarrinho(id);

        if (item) {
            item.diminuirQuantidade();
            this.salvarItensCarrinho();
        }
    }
}

export default Repositorio;