// Classe Produto: modelo de um item do cardápio.
class Produto {
    // Recebe os dados vindos do formulário e os guarda como atributos do objeto.
    // Os atributos são públicos (acessados diretamente, sem getters/setters).
    constructor(nome, descricao, preco, categoria, imagem) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria;
        this.imagem = imagem;


    }

    // Valida os dados antes de salvar.
    // Percorre todos os valores do produto; se algum for indefinido, nulo, um único
    // espaço ou texto vazio, o produto é considerado inválido.
    // Retorna true (dados completos) ou false (há campo vazio).
    validarDados(produto) {

        // flag funciona como sinalizador: 0 = tudo certo, 1 = encontrou campo vazio.
        let flag = 0;
        Object.values(produto).forEach(element => {

            if (element === undefined || element === " " || element === null || element.length === 0) {
                flag = 1;
            }
        });

        // Resultado da validação: false se achou campo vazio, true caso contrário.
        if (flag === 1) {
            return false
        }else{
            return true
        }
            
    }
}

// Exporta a classe para ser usada em cardapio.js.
export default Produto;