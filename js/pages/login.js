import Repositorio from "../repositories/repositorio.js";
import Carrinho from "../script/carrinho.js";
import ItemCarrinho from "../script/itemCarrinho.js";
import Pedido from "../script/pedido.js";
import Produto from "../script/produto.js";
import Usuario from "../script/usuario.js";

const bd = new Repositorio();
const formCadastroUsuario = document.getElementById("formModal");
const formLogin = document.getElementById("formLogin");
const msg = document.getElementById("msg");

formCadastroUsuario.addEventListener("submit", (e) => {
    // Impede o recarregamento da página ao enviar
    e.preventDefault();


    const email = document.getElementById("inEmail").value;
    const senha = document.getElementById("inSenha1").value;
    const confirmarSenha = document.getElementById("inSenha2").value;
    const tipoUserChecked = document.querySelector('input[name="tipoUser"]:checked');
    const tipoUsuario = tipoUserChecked ? tipoUserChecked.value : "";

    // Adicionada a palavra-chave const

    if (senha === confirmarSenha) {
        const dadosUsuario = new Usuario(email, senha, tipoUsuario);

        if (dadosUsuario.validarDados(dadosUsuario)) {
            bd.adicionarUsuario(dadosUsuario);
            console.log("Usuário Cadastrado.")
        }
        else {
            msg.innerText = "Campos vazios! \nDigite os dados novamente.";
        }
    }
    else {
        msg.innerText = "As senhas não se coincidem!\nDigite novamente.";
    }

    //validarDados(dadosUsuario);
});

formLogin.addEventListener("submit", (e) =>{

    e.preventDefault();
    
    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    const listaUsuarios = bd.getUsuarios();

    Object.values(listaUsuarios).forEach(element => {

        if (senha === element.usuario.senha && email === element.usuario.email){

            console.log("logado");
        }
        else{
            console.log("email e/ou senha incorretos");
        }
        
    });
})