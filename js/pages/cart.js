// cart.js: script da página do carrinho (carrinho.html).
import Repositorio from "../repositories/repositorio.js";

// Repositório: acesso ao carrinho e aos pedidos salvos (localStorage).
const bd = new Repositorio();

// Container (#carrinho) onde os itens do carrinho são mostrados.
const carrinho = document.getElementById("carrinho");

// As referências nomeProd até preview são do formulário de produto do cardápio;
// não existem em carrinho.html e não têm uso efetivo nesta página.
const nomeProd = document.getElementById("inNomeProd");
const descricaoProd = document.getElementById("inDescricaoProd");
const precoProd = document.getElementById("inPrecoProd");
const categoriaProd = document.getElementById("inCategoriaProd");
const imagemProd = document.getElementById("inImagemProd");
const preview = document.getElementById("preview");
// Referências do fluxo de fechar pedido: botão, lista do resumo no modal, formulário, campos e total.
const fecharPedido = document.getElementById("fechar-pedido");
const itensClosePedido = document.getElementById("itensCarrinho");
const form = document.getElementById("formFinalizarPedido");
// O id 'inTipoEntrega' não existe no HTML (o select se chama 'inEntregaPedido'); esta variável não é usada.
const tipoEntrega = document.getElementById("inTipoEntrega")
const nomeCliente = document.getElementById("inClienteNome");
const enderecoCliente = document.getElementById("inClienteEndereco");
const detalhesPedido = document.getElementById("inDetalhesPedido");
const totalPedido = document.getElementById("totalPedido");

// Chave de modo para adicionarItemNoCarrinho:
// false = desenha o card do item na tela do carrinho; true = desenha a linha do resumo dentro do modal "Pedido".
let isFinalizar = false;

// =============================================================
// CARREGAR CARRINHO
// =============================================================

//  Ao carregar a página, mostra os itens do carrinho aberto e o subtotal
document.addEventListener("DOMContentLoaded", () => {
    // Busca APENAS o carrinho aberto, ignorando os antigos
    const carrinhoAberto = bd.getCarrinhoAberto();

    if (carrinhoAberto) {
        carrinhoAberto.itens.forEach(item => {
            adicionarItemNoCarrinho(item);
        });
    }

    carregarSubtotal();
});

// Ao clicar em "Fechar pedido": ativa o modo resumo, limpa o resumo anterior
// e redesenha os itens do carrinho dentro do modal.
fecharPedido.addEventListener("click", () => {
    isFinalizar = true;

    limparUltimasPedidos();

    // Novamente, usa apenas o carrinho aberto
    const carrinhoAberto = bd.getCarrinhoAberto();

    if (carrinhoAberto) {
        carrinhoAberto.itens.forEach(item => {
            adicionarItemNoCarrinho(item);
        });
    }
});

// Evento do Bootstrap: quando o modal "Pedido" fecha, volta ao modo normal (isFinalizar = false).
form.addEventListener("hidden.bs.modal", () => {
    //a constante que guarda o id do item em edição é resetada
    isFinalizar = false;
});

// Evento do Bootstrap: quando o modal "Pedido" termina de abrir, garante que existe um pedido aberto,
// aplica o tipo de entrega já escolhido, calcula o total (com a taxa, se houver) e mostra na tela
form.addEventListener("shown.bs.modal", (e) => {
    isFinalizar = true;

    // Garante que o pedido está aberto
    if (!bd.buscarPedidoAberto()) {
        bd.abrirPedido();
    }

    const pedidoAberto = bd.buscarPedidoAberto().pedido;

    // Pega o valor atual do select para aplicar a taxa corretamente desde a abertura
    const tipoAtual = document.getElementById("inEntregaPedido").value;
    if (tipoAtual) {
        pedidoAberto.setTipoEntrega(tipoAtual);
    }

    // Calcula e salva o estado atualizado
    bd.calcularTotal(pedidoAberto.getTipoEntrega());
    bd.salvarPedido();

    // Atualiza a tela com o valor formatado
    totalPedido.innerText = `${pedidoAberto.getTotal().toFixed(2)}`;
});

// A cada alteração nos campos do modal (tipo de entrega ou nome do cliente), atualiza o pedido aberto,
// recalcula o total e mostra o novo valor na hora (a taxa aparece ao escolher delivery com marmita)
form.addEventListener("input", (e) => {
    const registro = bd.buscarPedidoAberto();
    if (!registro) return;

    const pedidoAberto = registro.pedido;

    switch (e.target.id) {
        // Mudou o tipo de entrega: guarda no pedido.
        case "inEntregaPedido": // id correto definido no carrinho.html
            pedidoAberto.setTipoEntrega(e.target.value);
            break;
        // Digitou o nome do cliente: guarda no pedido.
        case "inClienteNome":
            pedidoAberto.setCliente(e.target.value);
            break;
    }

    const tipo = pedidoAberto.getTipoEntrega();

    // Recalcula o total passando o tipo ("delivery", "retirada", etc.)
    bd.calcularTotal(tipo);

    totalPedido.innerText = `${pedidoAberto.getTotal().toFixed(2)}`;

    bd.salvarPedido();
});

//  Finalizar o pedido: ao enviar o formulário, marca o pedido como "Finalizado" (objeto Pedido
// com cliente, itens, tipo de entrega e total), fecha e esvazia o carrinho, avisa o usuário e volta para a Home.
// O preventDefault evita recarregar a página antes da hora.
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que a página recarregue antes da hora
    
    const pedidoAberto = bd.buscarPedidoAberto();
    const carrinhoAberto = bd.buscarCarrinhoAberto();
    
    if (pedidoAberto) {
        // Muda o status conforme a regra da classe Pedido
        // O pedido deixa de ser considerado aberto.
        pedidoAberto.pedido.status = "Finalizado"; 
        bd.salvarPedido();

        // Marca o carrinho como fechado (status diferente de true).
        carrinhoAberto.carrinho.status = "false";
        bd.salvarCarrinho();
        
        // Confirma para o usuário que o pedido foi concluído.
        alert("Pedido realizado com sucesso!");
        
        // Esvazia o carrinho para o próximo pedido
        bd.limparCarrinhoAberto(); 
        
        // Redireciona o usuário de volta para a Home ou recarrega a página
        window.location.href = "index.html";
    }
});


// =============================================================
// ADICIONAR ITEM NA TELA
// =============================================================

//  Desenha um item do carrinho na tela. Tem dois modos, escolhidos por isFinalizar:
// - true: linha do resumo do pedido (nome, quantidade e preço) dentro do modal;
// - false: card completo do item no carrinho (imagem, nome, descrição, preço e botões).
export const adicionarItemNoCarrinho = function (item) {

    // Modo resumo do pedido (dentro do modal).
    if (isFinalizar === true) {


        const produto = item.produto;

        // CARD
        const listaItensPedido =
            document.createElement("div");

        listaItensPedido.classList.add(
            "listaItensPedido"
        );

        // NOME
        const nomeSpan =
            document.createElement("span");

        nomeSpan.classList.add(
            "nomeItemPedido"
        );

        nomeSpan.appendChild(
            document.createTextNode(produto.nome)
        );

        // PREÇO
        const precoSpan =
            document.createElement("span");

        precoSpan.classList.add(
            "precoItemPedido"
        );

        precoSpan.appendChild(
            document.createTextNode(
                produto.preco
            )
        );

        // QUANTIDADE
        const showQtdSpan =
            document.createElement("span");

        showQtdSpan.classList.add(
            "qtdItemPedido"
        );

        showQtdSpan.appendChild(
            document.createTextNode(
                item.quantidade
            )
        );


        // MONTAR LISTA
        listaItensPedido.appendChild(
            nomeSpan
        );

        listaItensPedido.appendChild(
            showQtdSpan
        );

        listaItensPedido.appendChild(
            precoSpan
        );

        // ADICIONAR À TELA
        itensClosePedido.appendChild(
            listaItensPedido
        );

    } else {
        // Modo normal: card do item na tela do carrinho, com botões de excluir e de quantidade.
        const produto = item.produto;

        // CARD
        const cardItemCarrinho =
            document.createElement("div");


        cardItemCarrinho.classList.add(
            "cardItemCarrinho"
        );

        // IMAGEM
        const imgProd =
            document.createElement("img");

        imgProd.setAttribute(
            "src",
            produto.imagem
        );

        imgProd.classList.add("imgProd");


        const imgSpan =
            document.createElement("span");

        imgSpan.appendChild(imgProd);

        // NOME
        const nomeSpan =
            document.createElement("span");

        nomeSpan.classList.add(
            "imgCardItemCarrinho"
        );

        nomeSpan.appendChild(
            document.createTextNode(produto.nome)
        );

        // DESCRIÇÃO
        const descricaoSpan =
            document.createElement("span");

        descricaoSpan.classList.add(
            "descricaoCardItemCarrinho"
        );

        descricaoSpan.appendChild(
            document.createTextNode(
                produto.descricao
            )
        );

        // PREÇO
        const precoSpan =
            document.createElement("span");

        precoSpan.classList.add(
            "precoCardItemCarrinho"
        );

        precoSpan.appendChild(
            document.createTextNode(
                produto.preco
            )
        );

        // CATEGORIA
        const categoriaSpan =
            document.createElement("span");

        categoriaSpan.classList.add(
            "categoriaCardItemCarrinho"
        );

        categoriaSpan.appendChild(
            document.createTextNode(
                produto.categoria
            )
        );

        // BOTÕES
        const botoesSpan =
            document.createElement("span");

        botoesSpan.classList.add(
            "botoesCardItemCarrinho"
        );


        // Controle de quantidade do item: botões + e - com o número entre eles.
        const controlQtdSpan =
            document.createElement("span");

        controlQtdSpan.classList.add(
            "controlQtdCardItemCarrinho"
        );

        // BOTÃO AUMENTAR
        const btnAumentarQtd =
            document.createElement("i");

        btnAumentarQtd.classList.add(
            "fas",
            "fa-plus"
        );

        // QUANTIDADE
        const showQtdSpan =
            document.createElement("span");

        showQtdSpan.textContent =
            item.quantidade;

        // BOTÃO DIMINUIR
        const btnDiminuirQtd =
            document.createElement("i");

        btnDiminuirQtd.classList.add(
            "fas",
            "fa-minus"
        );

        // AUMENTAR QUANTIDADE
        //  Botão +: aumenta a quantidade do item, atualiza o número na tela, salva e recalcula o subtotal .
        btnAumentarQtd.addEventListener(
            "click",
            function () {

                item.aumentarQuantidade();

                showQtdSpan.textContent =
                    item.quantidade;

                bd.salvarCarrinho();

                carregarSubtotal();
            }
        );

        // DIMINUIR QUANTIDADE
        //  Botão -: diminui a quantidade do item (nunca abaixo de 1), atualiza o número na tela, salva e recalcula o subtotal.
        btnDiminuirQtd.addEventListener(
            "click",
            function () {

                item.diminuirQuantidade();

                showQtdSpan.textContent =
                    item.quantidade;

                bd.salvarCarrinho();

                carregarSubtotal();
            }
        );

        // MONTAR CONTROLE DE QUANTIDADE
        controlQtdSpan.appendChild(
            btnAumentarQtd
        );

        controlQtdSpan.appendChild(
            showQtdSpan
        );

        controlQtdSpan.appendChild(
            btnDiminuirQtd
        );

        // EXCLUIR
        const botaoExcluir =
            document.createElement("i");

        botaoExcluir.classList.add(
            "fas",
            "fa-trash-alt"
        );


        //  Botão lixeira: remove o item (com confirmação) e atualiza o subtotal.
        botaoExcluir.addEventListener(
            "click",
            function () {

                excluirItem(
                    cardItemCarrinho,
                    bd.buscarIndiceItem(item)
                );

                carregarSubtotal();
            }
        );

        // MONTAR BOTÕES
        botoesSpan.appendChild(
            botaoExcluir
        );

        botoesSpan.appendChild(
            controlQtdSpan
        );

        // MONTAR CARD
        cardItemCarrinho.appendChild(
            imgSpan
        );

        cardItemCarrinho.appendChild(
            nomeSpan
        );

        cardItemCarrinho.appendChild(
            descricaoSpan
        );

        cardItemCarrinho.appendChild(
            precoSpan
        );

        cardItemCarrinho.appendChild(
            botoesSpan
        );

        // ADICIONAR À TELA
        carrinho.appendChild(
            cardItemCarrinho
        );
    }
};


// =============================================================
// EXCLUIR ITEM
// =============================================================

//  Remove um item do carrinho. Pede confirmação antes [IHC - prevenção de erros];
// se o usuário confirmar, tira o card da tela e apaga o item do repositório.
const excluirItem = function (
    cardItemCarrinho,
    item
) {

    if (confirm("Tem certeza que deseja remover este item?")) {
        cardItemCarrinho.remove();

        // Remove o item no repositório (a posição vem de bd.buscarIndiceItem(item), chamado no clique da lixeira).
        bd.apagarItemCarrinho(
            item
        );
    }
};

// =============================================================
// LIMPAR CAMPOS
// =============================================================

// Limpa os campos do formulário de produto (resto do cardápio; não é chamada nesta página).
const limparCampos = function () {

    nomeProd.value = "";
    descricaoProd.value = "";
    precoProd.value = "";
    categoriaProd.value = "";
    preview.src = "";
};

// Busca o subtotal no repositório e mostra em <span id="subtotal">.
// Chamada ao carregar a página e a cada mudança (+, - ou excluir)
export const carregarSubtotal = () => {
    const subtotal = bd.getSubtotal();
    const mostrarSub = document.getElementById("subtotal");
    mostrarSub.innerText = subtotal;
}


// Esvazia o resumo do modal removendo os filhos um a um, para não repetir linhas quando o modal é reaberto.
const limparUltimasPedidos = () => {

    //enquanto houver elementos filhos vai apagando um a um desse espaço 
    while (itensClosePedido.firstChild) {
        itensClosePedido.removeChild(itensClosePedido.firstChild);
    }
}

//  Botão "Limpar Carrinho": pede confirmação, esvazia o carrinho e recarrega a página para a tela refletir o carrinho vazio.
const btnLimparCarrinho = document.getElementById("limpar-carrinho");

btnLimparCarrinho.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja esvaziar todo o carrinho?")) {
        bd.limparCarrinhoAberto();
        window.location.reload(); // Recarrega a tela para limpar o HTML
    }
});