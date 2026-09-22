import categoriaProduto from "./categoriaProduto.js";


class Produto {
    constructor(nome, descricao, preco, categoria, imagem) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria;
        this.imagem = imagem;


    }

    validarDados(produto) {

        let flag = 0;
        Object.values(produto).forEach(element => {

            if (element === undefined || element === " " || element === null || element.length === 0) {
                flag = 1;
            }
        });

        if (flag === 1) {
            return false
        }else{
            return true
        }
            
    }
}

export default Produto;