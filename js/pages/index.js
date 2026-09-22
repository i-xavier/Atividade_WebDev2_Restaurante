import Repositorio from "../repositories/repositorio.js";
import Carrinho from "../script/carrinho.js";
import ItemCarrinho from "../script/itemCarrinho.js";
import Pedido from "../script/pedido.js";
import Produto from "../script/produto.js";
import Usuario from "../script/usuario.js";
import { adicionarItemNoCarrinho } from "./cart.js";

const bd = new Repositorio();
const form = document.getElementById("formCadastroProd");
const carrossel = document.getElementById("carrossel");
const nomeProd = document.getElementById("inNomeProd");
const descricaoProd = document.getElementById("inDescricaoProd");
const precoProd = document.getElementById("inPrecoProd");
const categoriaProd = document.getElementById("inCategoriaProd");
const imagemProd = document.getElementById("inImagemProd");
const preview = document.getElementById("preview");

document.addEventListener('DOMContentLoaded', () => {

    const listaProdutos = bd.getProdutos();

    listaProdutos.forEach(element => {

        //(id, nome, descricao, preco, categoria, img) 
        adicionarProdCarrossel(element.id, element.produto.nome, /*element.produto.descricao,*/ element.produto.preco, /*element.produto.categoria,*/ element.produto.imagem);
    });
});

const adicionarProdCarrossel = function (id, nome, /*descricao,*/ preco, /*categoria,*/ img) {
    const cardProd = document.createElement("div");
    cardProd.classList.add("cardProd");
    cardProd.id = id;

    const imgProd = document.createElement("img");
    imgProd.setAttribute("src", img);
    imgProd.classList.add('imgCarrossel');
    const imgSpan = document.createElement("span");
    imgSpan.appendChild(imgProd);

    const nomeSpan = document.createElement("span");
    const nomeContent = document.createTextNode(nome);
    nomeSpan.classList.add("nomeCarrossel");
    nomeSpan.appendChild(nomeContent);

    /*const descricaoSpan = document.createElement("span");
    const descricaoContent = document.createTextNode(descricao);
    descricaoSpan.classList.add("descricaoCardProd")
    descricaoSpan.appendChild(descricaoContent);*/

    const precoSpan = document.createElement("span");
    const precoContent = document.createTextNode(preco);
    precoSpan.classList.add("precoCarrossel")
    precoSpan.appendChild(precoContent);

    /*const categoriaSpan = document.createElement("span");
    const categoriaContent = document.createTextNode(categoria);
    categoriaSpan.classList.add("categoriaCardProd")
    categoriaSpan.appendChild(categoriaContent);*/

    const botoesSpan = document.createElement("span");
    botoesSpan.classList.add("botoesCarrossel")

    const botaoAddCarrinho = document.createElement("i");
    botaoAddCarrinho.classList.add("fas", "fa-shopping-cart", "me-2")

    botaoAddCarrinho.addEventListener("click", function () {
        bd.adicionarItemCarrinho(id);
        const idItem = bd.getUltimoId();
        console.log(idItem);
        adicionarItemNoCarrinho(idItem, nome, descricao, preco, img);

    })

    botoesSpan.appendChild(botaoAddCarrinho);

    cardProd.appendChild(imgSpan);
    cardProd.appendChild(nomeSpan);
   // cardProd.appendChild(descricaoSpan);
    cardProd.appendChild(precoSpan);
    //cardProd.appendChild(categoriaSpan);
    cardProd.appendChild(botoesSpan);


    carrossel.appendChild(cardProd);

}

const wrapper = document.querySelector('.carrossel-wrapper');
document.querySelector('.fa-arrow-left')?.addEventListener('click', () => wrapper.scrollBy({ left: -260, behavior: 'smooth' }));
document.querySelector('.fa-arrow-right')?.addEventListener('click', () => wrapper.scrollBy({ left: 260, behavior: 'smooth' }));