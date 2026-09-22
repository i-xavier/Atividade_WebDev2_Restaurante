import Repositorio from "../repositories/repositorio.js";
import Carrinho from "../script/carrinho.js";
import ItemCarrinho from "../script/itemCarrinho.js";
import Pedido from "../script/pedido.js";
import Produto from "../script/produto.js";
import Usuario from "../script/usuario.js";


const bd = new Repositorio();
//const form = document.getElementById("formCadastroProd");
//const msg = document.getElementById("msg");
const carrinho = document.getElementById("carrinho");
//let idProdutoEditando = null;
const nomeProd = document.getElementById("inNomeProd");
const descricaoProd = document.getElementById("inDescricaoProd");
const precoProd = document.getElementById("inPrecoProd");
const categoriaProd = document.getElementById("inCategoriaProd");
const imagemProd = document.getElementById("inImagemProd");
const preview = document.getElementById("preview");

/*imagemProd.addEventListener("change", () => {
    preview.src = imagemProd.value;
});*/

document.addEventListener('DOMContentLoaded', () => {

    const listaProdutos = bd.getItensCarrinho();

    listaProdutos.forEach(element => {

        //(id, nome, descricao, preco, categoria, img) 
        adicionarItemNoCarrinho(element.id, element.itemCarrinho.produto.nome, element.itemCarrinho.produto.descricao, element.itemCarrinho.produto.preco, element.itemCarrinho.produto.categoria, element.itemCarrinho.produto.imagem);
    });
});

/*
form.addEventListener("hidden.bs.modal", () => {

    idProdutoEditando = null;

})*/

/*form.addEventListener("submit", (e) => {
    e.preventDefault();

    
});*/

export const adicionarItemNoCarrinho = function (id, nome, descricao, preco, categoria, img) {
    const cardItemCarrinho = document.createElement("div");
    cardItemCarrinho.classList.add("cardItemCarrinho");
    cardItemCarrinho.id = id;

    const item = bd.getItemCarrinho(id);

    console.log(id);
    console.log(nome);
    console.log(descricao);
    console.log(preco);
    console.log(categoria);
    console.log(img);

    const imgProd = document.createElement("img");
    imgProd.setAttribute("src", img);
    imgProd.classList.add('imgProd');
    const imgSpan = document.createElement("span");
    imgSpan.appendChild(imgProd);

    const nomeSpan = document.createElement("span");
    const nomeContent = document.createTextNode(nome);
    nomeSpan.classList.add("imgCardItemCarrinho");
    nomeSpan.appendChild(nomeContent);

    const descricaoSpan = document.createElement("span");
    const descricaoContent = document.createTextNode(descricao);
    descricaoSpan.classList.add("descricaoCardItemCarrinho")
    descricaoSpan.appendChild(descricaoContent);

    const precoSpan = document.createElement("span");
    const precoContent = document.createTextNode(preco);
    precoSpan.classList.add("precoCardItemCarrinho")
    precoSpan.appendChild(precoContent);

    const categoriaSpan = document.createElement("span");
    const categoriaContent = document.createTextNode(categoria);
    categoriaSpan.classList.add("categoriaCardItemCarrinho")
    categoriaSpan.appendChild(categoriaContent);

    const botoesSpan = document.createElement("span");
    botoesSpan.classList.add("botoesCardItemCarrinho")

    const controlQtdSpan = document.createElement("span");
    botoesSpan.classList.add("controlQtdCardItemCarrinho");

    //<i class="bi bi-plus"></i>
    //glyphicon glyphicon-plus
    const btnAumentarQtd = document.createElement("i");
    btnAumentarQtd.classList.add("fas", "fa-plus");

    const showQtdSpan = document.createElement("span");
    const qtdContent = document.createTextNode(bd.getQuantidadeItem(id));
    showQtdSpan.appendChild(qtdContent);
    //glyphicon glyphicon-minus
    const btnDiminuirQtd = document.createElement("i");
    btnDiminuirQtd.classList.add("fas", "fa-minus");


    btnAumentarQtd.addEventListener("click", function () {
        bd.aumentarQuantidadeItem(id);
        showQtdSpan.textContent = bd.getQuantidadeItem(id);
    });

    btnDiminuirQtd.addEventListener("click", function () {
        bd.diminuirQuantidadeItem(id);
        showQtdSpan.textContent = bd.getQuantidadeItem(id);
    });

    controlQtdSpan.appendChild(btnAumentarQtd);
    controlQtdSpan.appendChild(showQtdSpan);
    controlQtdSpan.appendChild(btnDiminuirQtd);

    const botaoExcluir = document.createElement("i");
    botaoExcluir.classList.add("fas", "fa-trash-alt");

    botaoExcluir.addEventListener("click", function () {
        excluirItem(cardItemCarrinho, id);
    })

    botoesSpan.appendChild(botaoExcluir);
    botoesSpan.appendChild(controlQtdSpan);

    cardItemCarrinho.appendChild(imgSpan);
    cardItemCarrinho.appendChild(nomeSpan);
    cardItemCarrinho.appendChild(descricaoSpan);
    cardItemCarrinho.appendChild(precoSpan);
    //cardItemCarrinho.appendChild(categoriaSpan);
    cardItemCarrinho.appendChild(botoesSpan);


    carrinho.appendChild(cardItemCarrinho);

}

const excluirItem = function (cardItemCarrinho, id) {
    cardItemCarrinho.remove()
    bd.apagarItemCarrinho(id);
};


const limparCampos = function () {
    nomeProd.value = ""
    descricaoProd.value = ""
    precoProd.value = ""
    categoriaProd.value = ""
    preview.src = "";

}

