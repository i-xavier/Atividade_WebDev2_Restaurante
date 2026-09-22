import Repositorio from "../repositories/repositorio.js";
import Carrinho from "../script/carrinho.js";
import ItemCarrinho from "../script/itemCarrinho.js";
import Pedido from "../script/pedido.js";
import Produto from "../script/produto.js";
import Usuario from "../script/usuario.js";
import { adicionarItemNoCarrinho } from "./cart.js";

const bd = new Repositorio();
const form = document.getElementById("formCadastroProd");
const msg = document.getElementById("msg");
const cardapio = document.getElementById("cardapio");
let add = document.getElementById("add");
let idProdutoEditando = null;
const nomeProd = document.getElementById("inNomeProd");
const descricaoProd = document.getElementById("inDescricaoProd");
const precoProd = document.getElementById("inPrecoProd");
const categoriaProd = document.getElementById("inCategoriaProd");
const imagemProd = document.getElementById("inImagemProd");
const preview = document.getElementById("preview");

imagemProd.addEventListener("change", () => {
    preview.src = imagemProd.value;
});

document.addEventListener('DOMContentLoaded', () => {

    const listaProdutos = bd.getProdutos();

    listaProdutos.forEach(element => {

        //(id, nome, descricao, preco, categoria, img) 
        adicionarProdCardapio(element.id, element.produto.nome, element.produto.descricao, element.produto.preco, element.produto.categoria, element.produto.imagem);
    });
});

form.addEventListener("hidden.bs.modal", () => {

    idProdutoEditando = null;

})

form.addEventListener("submit", (e) => {
    e.preventDefault();

    /*if (idProdutoEditando === 1) {

    }*/

    const dadosProduto = new Produto(nomeProd.value, descricaoProd.value, precoProd.value, categoriaProd.value, imagemProd.value);


    if (idProdutoEditando === null) {

        if (dadosProduto.validarDados(dadosProduto)) {
            msg.innerText = "";
            bd.adicionarProduto(dadosProduto);
            adicionarProdCardapio(bd.getProdutoId(dadosProduto), nomeProd.value, descricaoProd.value, precoProd.value, categoriaProd.value, imagemProd.value)

            // Define temporariamente o atributo do Bootstrap para fechar o modal após o envio
            add.setAttribute("data-bs-dismiss", "modal");

            add.click();

            //remove o valor para as próximas adições
            add.setAttribute("data-bs-dismiss", "");

            alert("Produto Cadastrado.")

        } else {
            msg.innerText = "Campos vazios! \nDigite os dados novamente.";
        }

    } else {

        if (dadosProduto.validarDados(dadosProduto)) {

            msg.innerText = "";

            const alterado = bd.alterarProduto(idProdutoEditando, dadosProduto);

            carregarEdicao(idProdutoEditando);

            if (alterado) {
                alert("Produto alterado.");

                // Define temporariamente o atributo do Bootstrap para fechar o modal após o envio
                add.setAttribute("data-bs-dismiss", "modal");

                add.click();

                //remove o valor para as próximas adições
                add.setAttribute("data-bs-dismiss", "");

                limparCampos();

            } else {
                alert("Falha ao alterar produto")
            }



        } else {
            msg.innerText = "Campos vazios! \nDigite os dados novamente.";
        }

    }
});

const adicionarProdCardapio = function (id, nome, descricao, preco, categoria, img) {
    const cardProd = document.createElement("div");
    cardProd.classList.add("cardProd");
    cardProd.id = id;

    const imgProd = document.createElement("img");
    imgProd.setAttribute("src", img);
    imgProd.classList.add('imgProd');
    const imgSpan = document.createElement("span");
    imgSpan.appendChild(imgProd);

    const nomeSpan = document.createElement("span");
    const nomeContent = document.createTextNode(nome);
    nomeSpan.classList.add("nomeCardProd");
    nomeSpan.appendChild(nomeContent);

    const descricaoSpan = document.createElement("span");
    const descricaoContent = document.createTextNode(descricao);
    descricaoSpan.classList.add("descricaoCardProd")
    descricaoSpan.appendChild(descricaoContent);

    const precoSpan = document.createElement("span");
    const precoContent = document.createTextNode(preco);
    precoSpan.classList.add("precoCardProd")
    precoSpan.appendChild(precoContent);

    const categoriaSpan = document.createElement("span");
    const categoriaContent = document.createTextNode(categoria);
    categoriaSpan.classList.add("categoriaCardProd")
    categoriaSpan.appendChild(categoriaContent);

    const botoesSpan = document.createElement("span");
    botoesSpan.classList.add("botoesCardProd")

    const botaoEditar = document.createElement("i");
    botaoEditar.classList.add("fas", "fa-edit");
    botaoEditar.setAttribute("data-bs-toggle", "modal");
    botaoEditar.setAttribute("data-bs-target", "#formCadastroProd");

    botaoEditar.addEventListener("click", function () {
        editarItem(nome, descricao, preco, categoria, img, id);
    })

    const botaoExcluir = document.createElement("i");
    botaoExcluir.classList.add("fas", "fa-trash-alt");

    botaoExcluir.addEventListener("click", function () {
        excluirItem(cardProd, id);
    })

    const botaoAddCarrinho = document.createElement("i");
    botaoAddCarrinho.classList.add("fas", "fa-shopping-cart", "me-2")

    botaoAddCarrinho.addEventListener("click", function () {
        bd.adicionarItemCarrinho(id);
        const idItem = bd.getUltimoId();
        console.log(idItem);
        adicionarItemNoCarrinho(idItem, nome, descricao, preco, categoria, img);

    })

    botoesSpan.appendChild(botaoEditar);
    botoesSpan.appendChild(botaoExcluir);
    botoesSpan.appendChild(botaoAddCarrinho);

    cardProd.appendChild(imgSpan);
    cardProd.appendChild(nomeSpan);
    cardProd.appendChild(descricaoSpan);
    cardProd.appendChild(precoSpan);
    //cardProd.appendChild(categoriaSpan);
    cardProd.appendChild(botoesSpan);


    cardapio.appendChild(cardProd);

}

const editarItem = function (nome, descricao, preco, categoria, img, id) {

    nomeProd.value = nome;
    descricaoProd.value = descricao;
    precoProd.value = preco;
    categoriaProd.value = categoria;
    preview.src = img;
    imagemProd.value = img;

    //console.log(idProdutoEditando.length);
    idProdutoEditando = id;
    //console.log(idProdutoEditando.length);

};

const excluirItem = function (cardProd, id) {
    cardProd.remove()
    bd.apagarProduto(id);
};

const carregarEdicao = function (id) {

    const pai = document.getElementById(id);
    const filhos = pai.children;
    const elemento = bd.buscarProduto(id);

    console.log(filhos);

    // new Produto(nomeProd.value, descricaoProd.value, precoProd.value, categoriaProd.value, imagemProd.value);

    filhos[0].firstChild.src = elemento.produto.imagem;
    filhos[1].innerText = elemento.produto.nome;
    filhos[2].innerText = elemento.produto.descricao;
    filhos[3].innerText = elemento.produto.preco;

}


const limparCampos = function () {
    nomeProd.value = ""
    descricaoProd.value = ""
    precoProd.value = ""
    categoriaProd.value = ""
    preview.src = "";

}