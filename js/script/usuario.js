import tipoUsuario from "./tipoUsuario.js";

class Usuario {

    constructor(email, senha, tipo) {
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
        this.isLogado = false;
    }

    validarDados(usuario) {

        Object.values(usuario).forEach(element => {
            if (element === undefined || element === '' || element === null) {
                return false;
            }
        });

        return true;
    }
}

export default Usuario;