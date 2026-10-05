import Repositorio from "../repositories/repositorio.js";
import Produto from "../script/produto.js";

// Repositório: acesso aos dados salvos no localStorage [BÔNUS].
const bd = new Repositorio();
// Referências aos elementos da página: modal/formulário, mensagem de erro, lista de cards e campos do formulário.
const form = document.getElementById("formCadastroProd");
const msg = document.getElementById("msg");
const cardapio = document.getElementById("cardapio");
let add = document.getElementById("add");
// Controle de modo do formulário: null = cadastrando um produto novo;
// com um id = editando o produto que tem esse id.
let idProdutoEditando = null;
const nomeProd = document.getElementById("inNomeProd");
const descricaoProd = document.getElementById("inDescricaoProd");
const precoProd = document.getElementById("inPrecoProd");
const categoriaProd = document.getElementById("inCategoriaProd");
const imagemProd = document.getElementById("inImagemProd");
const preview = document.getElementById("preview");

//Mostra a pré-visualização da imagem escolhida no formulário.
imagemProd.addEventListener("change", () => {
    preview.src = imagemProd.value;
});

// Quando a página carrega, lê os produtos do repositório e cria um card para cada um.
// Por usar o localStorage, o cardápio continua ali depois de recarregar a página [BÔNUS].
document.addEventListener('DOMContentLoaded', () => {

    const listaProdutos = bd.getProdutos();

    listaProdutos.forEach(element => {

        //(id, nome, descricao, preco, categoria, img) 
        adicionarProdCardapio(element.id, element.produto.nome, element.produto.descricao, element.produto.preco, element.produto.categoria, element.produto.imagem);
    });
});

// Quando o modal termina de fechar, sai do modo edição (volta a ser cadastro).
form.addEventListener("hidden.bs.modal", () => {

    idProdutoEditando = null;

})

// Envio do formulário do modal: CADASTRA um produto novo ou ALTERA um existente,
// conforme idProdutoEditando. Valida os dados antes [IHC - prevenção de erros].
// O preventDefault evita recarregar a página.
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Cria o objeto Produto com os valores digitados no formulário.
    const dadosProduto = new Produto(nomeProd.value, descricaoProd.value, precoProd.value, categoriaProd.value, imagemProd.value);


    // Modo CADASTRO: se os dados forem válidos salva o produto, cria o card e fecha o modal.
    if (idProdutoEditando === null) {

        if (dadosProduto.validarDados(dadosProduto)) {
            msg.innerText = "";
            // Salva o novo produto no repositório (localStorage).
            bd.adicionarProduto(dadosProduto);
            // Cria o card do produto na tela, usando o id que o repositório acabou de gerar.
            adicionarProdCardapio(bd.getProdutoId(dadosProduto), nomeProd.value, descricaoProd.value, precoProd.value, categoriaProd.value, imagemProd.value)

            // Define temporariamente o atributo do Bootstrap para fechar o modal após o envio
            add.setAttribute("data-bs-dismiss", "modal");

            add.click();

            //remove o valor para as próximas adições
            add.setAttribute("data-bs-dismiss", "");

            // Confirma para o usuário que o produto foi cadastrado.
            alert("Produto Cadastrado.")

        } else {
            // Mensagem de validação mostrada dentro do modal.
            msg.innerText = "Campos vazios! \nDigite os dados novamente.";
        }

    } else {

        if (dadosProduto.validarDados(dadosProduto)) {

            msg.innerText = "";

            // Modo EDIÇÃO: grava as alterações no repositório e atualiza o card que já está na tela.
            // alterado indica se o produto foi encontrado e atualizado.
            const alterado = bd.alterarProduto(idProdutoEditando, dadosProduto);

            // Atualiza o card na tela com os dados novos, sem recarregar a página.
            carregarEdicao(idProdutoEditando);

            if (alterado) {
                // Confirma que o produto foi alterado.
                alert("Produto alterado.");

                // Define temporariamente o atributo do Bootstrap para fechar o modal após o envio
                add.setAttribute("data-bs-dismiss", "modal");

                add.click();

                //remove o valor para as próximas adições
                add.setAttribute("data-bs-dismiss", "");

                limparCampos();

            } else {
                // Avisa quando a alteração não foi possível.
                alert("Falha ao alterar produto")
            }



        } else {
            // Mensagem de validação mostrada dentro do modal.
            msg.innerText = "Campos vazios! \nDigite os dados novamente.";
        }

    }
});

// Monta o card de um produto (imagem, nome, descrição, preço e botões editar, excluir
// e adicionar ao carrinho) e o insere em #cardapio. Os elementos são criados com createElement
// e createTextNode e montados um dentro do outro.
const adicionarProdCardapio = function (id, nome, descricao, preco, categoria, img) {
    // Card (div) do produto; o id do elemento é o id do produto, para poder localizá-lo depois.
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

    // Botão EDITAR: abre o modal (atributos data-bs-toggle e data-bs-target do Bootstrap)
    // e, ao clicar, preenche o formulário com os dados do produto (editarItem).
    const botaoEditar = document.createElement("i");
    botaoEditar.classList.add("fas", "fa-edit");
    botaoEditar.setAttribute("data-bs-toggle", "modal");
    botaoEditar.setAttribute("data-bs-target", "#formCadastroProd");

    botaoEditar.addEventListener("click", function () {
        editarItem(nome, descricao, preco, categoria, img, id);
    })

    // Botão EXCLUIR: chama excluirItem, que pede confirmação antes de remover.
    const botaoExcluir = document.createElement("i");
    botaoExcluir.classList.add("fas", "fa-trash-alt");

    botaoExcluir.addEventListener("click", function () {
        excluirItem(cardProd, id);
    })

    // Botão ADICIONAR AO CARRINHO: busca o produto no repositório e o adiciona
    // ao carrinho aberto (abrirCarrinho); depois avisa o usuário com alert.
    const botaoAddCarrinho = document.createElement("i");
    botaoAddCarrinho.classList.add("fas", "fa-shopping-cart", "me-2")

    botaoAddCarrinho.addEventListener("click", function () {
        const registroProduto = bd.buscarProduto(id);

        if (registroProduto) {
            bd.abrirCarrinho(registroProduto.produto);
            alert(`${registroProduto.produto.nome} foi adicionado ao carrinho!`);
        } else {
            console.log("Erro ao adicionar produto");
        }

    })

    botoesSpan.appendChild(botaoEditar);
    botoesSpan.appendChild(botaoExcluir);
    botoesSpan.appendChild(botaoAddCarrinho);

    cardProd.appendChild(imgSpan);
    cardProd.appendChild(nomeSpan);
    cardProd.appendChild(descricaoSpan);
    cardProd.appendChild(precoSpan);
    cardProd.appendChild(botoesSpan);


    // Insere o card pronto na página.
    cardapio.appendChild(cardProd);

}

// Prepara a edição: copia os dados do produto para os campos do modal
// e guarda o id em idProdutoEditando (o que muda o submit para o modo edição).
const editarItem = function (nome, descricao, preco, categoria, img, id) {

    nomeProd.value = nome;
    descricaoProd.value = descricao;
    precoProd.value = preco;
    categoriaProd.value = categoria;
    preview.src = img;
    imagemProd.value = img;
    idProdutoEditando = id;
};

// Remove um produto do cardápio. Pede confirmação antes;
// se o usuário confirmar, tira o card da tela e apaga o produto do repositório.
const excluirItem = function (cardProd, id) {

    if (confirm("Tem certeza que deseja remover este item?")) {
        cardProd.remove();
        bd.apagarProduto(id); // no cart.js será bd.apagarItemCarrinho(item);
    }
};

// Atualiza o card que já está na tela (imagem, nome, descrição e preço) com os dados atuais
// do repositório, acessando os elementos filhos do card pela posição.
const carregarEdicao = function (id) {

    const pai = document.getElementById(id);
    const filhos = pai.children;
    const elemento = bd.buscarProduto(id);

    filhos[0].firstChild.src = elemento.produto.imagem;
    filhos[1].innerText = elemento.produto.nome;
    filhos[2].innerText = elemento.produto.descricao;
    filhos[3].innerText = elemento.produto.preco;
}


// Limpa os campos do formulário depois de uma edição.
const limparCampos = function () {
    nomeProd.value = ""
    descricaoProd.value = ""
    precoProd.value = ""
    categoriaProd.value = ""
    preview.src = "";
}