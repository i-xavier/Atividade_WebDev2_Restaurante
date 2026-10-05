class Pedido {
    // Cria o pedido com os dados recebidos; status e data são definidos automaticamente.
    constructor(cliente, itens, tipoEntrega, total) {
        this.cliente = cliente;
        this.itens = itens;
        this.tipoEntrega = tipoEntrega;
        // Todo pedido nasce "Pendente"; ao ser finalizado o status vira "Finalizado".
        this.status = "Pendente";
        // Data e hora em que o pedido foi criado.
        this.data = new Date();
        this.total = total;
    }

    // Getter: devolve o tipo de entrega (delivery, retirada ou consumo_local).
    getTipoEntrega(){
        return this.tipoEntrega;
    }

    // Informa se o pedido ainda está em andamento (status diferente de "Finalizado").
    // O Repositorio usa isso para achar o pedido aberto.
    estaAberto(){
        return this.status !== "Finalizado";
    }

    // Setter: define o nome do cliente.
    setCliente(cliente){
        this.cliente = cliente;
    }

    // Setter: define a lista de itens do pedido (vem do carrinho).
    setItens(itens){
        this.itens = itens;
    }

    // Setter: define o tipo de entrega (influencia a taxa).
    setTipoEntrega(tipoEntrega){
        this.tipoEntrega = tipoEntrega;
    }

    // Setter: define o valor total (subtotal + taxa de entrega).
    setTotal(total){
        this.total = total;
    }

    // Getter: devolve o total do pedido.
    getTotal(){

        return this.total;
    }

    // Getter: devolve o nome do cliente.
    getCliente(){

        return this.cliente;
    }
}

// Exporta a classe para ser usada em repositorio.js.
export default Pedido;