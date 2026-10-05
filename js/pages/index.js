import Repositorio from "../repositories/repositorio.js";


// Repositório: acesso aos produtos e ao carrinho (localStorage).
const bd = new Repositorio();
// Estas referências (form, nomeProd... preview) são do formulário de cadastro do cardápio
// e não existem nesta página; não são usadas aqui.
const form = document.getElementById("formCadastroProd");
// Container (#carrossel) onde os slides são inseridos.
const carrossel = document.getElementById("carrossel");
const nomeProd = document.getElementById("inNomeProd");
const descricaoProd = document.getElementById("inDescricaoProd");
const precoProd = document.getElementById("inPrecoProd");
const categoriaProd = document.getElementById("inCategoriaProd");
const imagemProd = document.getElementById("inImagemProd");
const preview = document.getElementById("preview");

// Quando a página carrega, lê os produtos salvos e cria um slide para cada um.
// Só nome, preço e imagem são usados; descrição e categoria ficam de fora.
document.addEventListener('DOMContentLoaded', () => {

    const listaProdutos = bd.getProdutos();

    listaProdutos.forEach(element => {

        //(id, nome, descricao, preco, categoria, img) 
        adicionarProdCarrossel(element.id, element.produto.nome, /*element.produto.descricao,*/ element.produto.preco, /*element.produto.categoria,*/ element.produto.imagem);
    });
});

// Monta o slide de um produto: imagem, nome, preço e botão de carrinho, e o adiciona ao carrossel. É uma versão reduzida do card do cardápio.
const adicionarProdCarrossel = function (id, nome, preco, img) {
    // Card (div) do slide; o id do elemento é o id do produto.
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

    const precoSpan = document.createElement("span");
    const precoContent = document.createTextNode(preco);
    precoSpan.classList.add("precoCarrossel")
    precoSpan.appendChild(precoContent);

    const botoesSpan = document.createElement("span");
    botoesSpan.classList.add("botoesCarrossel")

    // Botão (ícone) que adiciona o produto ao carrinho direto do carrossel.
    // Ao clicar: busca o produto no repositório, adiciona ao carrinho e avisa o usuário com alert
    const botaoAddCarrinho = document.createElement("i");
    botaoAddCarrinho.classList.add("fas", "fa-shopping-cart", "me-2")

    botaoAddCarrinho.addEventListener("click", function () {

        const registroProduto = bd.buscarProduto(id);

        if (registroProduto) {
            bd.abrirCarrinho(registroProduto.produto);
            alert(`${registroProduto.produto.nome} foi adicionado ao carrinho!`); // <- Adicione esta linha
        } else {
            console.log("Erro ao adicionar produto");
        }

    })

    botoesSpan.appendChild(botaoAddCarrinho);

    cardProd.appendChild(imgSpan);
    cardProd.appendChild(nomeSpan);
    cardProd.appendChild(precoSpan);
    cardProd.appendChild(botoesSpan);


    // Insere o slide pronto no carrossel.
    carrossel.appendChild(cardProd);

}

// Navegação por setas: as setas rolam o carrossel 
const wrapper = document.querySelector('.carrossel-wrapper');
document.querySelector('.fa-arrow-left')?.addEventListener('click', () => wrapper.scrollBy({ left: -260, behavior: 'smooth' }));
document.querySelector('.fa-arrow-right')?.addEventListener('click', () => wrapper.scrollBy({ left: 260, behavior: 'smooth' }));