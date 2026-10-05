# Restaurante AstroMeals

Site de um restaurante feito para a disciplina de **Desenvolvimento Web 2**. Nele é possível cadastrar os produtos do cardápio, adicionar itens ao carrinho e fechar um pedido. Os dados ficam salvos no navegador (`localStorage`), então não é preciso backend nem banco de dados.

## Funcionalidades

- **Home**: apresentação do restaurante e carrossel com os produtos cadastrados, com setas para navegar e botão para adicionar ao carrinho.
- **Cardápio**: CRUD completo de produtos.
  - Cadastrar (nome, descrição, preço, categoria e imagem, com pré-visualização).
  - Listar em cards.
  - Editar pelo mesmo modal do cadastro.
  - Excluir, com confirmação.
  - Validação de campos vazios.
- **Carrinho**:
  - Adicionar produtos a partir do cardápio ou do carrossel.
  - Aumentar e diminuir a quantidade (mínimo 1).
  - Remover itens individualmente.
  - Limpar o carrinho inteiro.
  - Subtotal sempre atualizado.
- **Pedido**:
  - Resumo dos itens, tipo de entrega (delivery, retirada ou consumo local) e nome do cliente.
  - Total calculado na hora.
  - **Taxa de entrega:** R$ 2,50 fixos quando o pedido é *delivery* e contém *marmita*. Nos outros casos não há taxa.
  - Ao finalizar, o pedido recebe o status "Finalizado" e o carrinho é esvaziado.
- **Persistência**: produtos, carrinho e pedidos continuam salvos depois de recarregar a página.

## Tecnologias

- HTML5, CSS3 e JavaScript (módulos ES, sem frameworks)
- [Bootstrap 5.1.3](https://getbootstrap.com/) (modais e botões), via CDN
- [Font Awesome 5.15.4](https://fontawesome.com/) (ícones), via CDN
- `localStorage` para guardar os dados

## Como rodar

Como o projeto usa módulos ES (`type="module"`), ele precisa ser aberto por um servidor local. Abrir o `index.html` com duplo clique (`file://`) não funciona.

Opções:

1. **Live Server** (extensão do VS Code): clique com o botão direito no `index.html` e escolha *Open with Live Server*.
2. **Python**, na pasta do projeto:
   ```bash
   python -m http.server 8000
   ```
   Depois acesse `http://localhost:8000`.

Na primeira vez o cardápio está vazio. Vá em **Cardápio > Cadastrar Produto** para criar os produtos.

> Para testar a taxa de entrega, cadastre um produto com a palavra **marmita** no nome, adicione-o ao carrinho e escolha **Delivery** ao fechar o pedido.

## Estrutura do projeto

```
.
├── index.html            # Home com o carrossel
├── cardapio.html         # Cardápio e CRUD de produtos
├── carrinho.html         # Carrinho e fechamento do pedido
├── style/
│   └── style.css         # Estilos de todas as páginas
├── assets/
│   └── img/              # Logo e imagens dos produtos
└── js/
    ├── pages/            # Scripts de cada página
    │   ├── index.js      # Monta o carrossel
    │   ├── cardapio.js   # Lista, cadastra, edita e exclui produtos
    │   └── cart.js       # Mostra o carrinho e finaliza o pedido
    ├── script/           # Classes de modelo (POO)
    │   ├── produto.js
    │   ├── itemCarrinho.js
    │   ├── carrinho.js
    │   └── pedido.js
    └── repositories/
        └── repositorio.js  # Acesso aos dados (localStorage)
```

## Organização do código

O código usa Programação Orientada a Objetos:

| Classe | Responsabilidade |
| --- | --- |
| `Produto` | Dados de um item do cardápio e validação dos campos |
| `ItemCarrinho` | Um produto no carrinho com sua quantidade |
| `Carrinho` | Lista de itens, status (aberto/fechado), subtotal, taxa de entrega e total |
| `Pedido` | Cliente, itens, tipo de entrega, total, status e data |
| `Repositorio` | Único ponto de acesso ao `localStorage`: lê, salva e recria os objetos |

As páginas (`index.js`, `cardapio.js` e `cart.js`) cuidam apenas da tela e usam o `Repositorio` para ler e gravar os dados.

## Dados salvos no navegador

O `localStorage` usa três chaves:

- `produtos`: lista de `{ id, produto }`
- `carrinho`: lista de `{ id, carrinho }`
- `pedidos`: lista de `{ id, pedido }`

Para zerar tudo, abra as ferramentas do desenvolvedor (F12), vá em *Application > Local Storage* e apague essas chaves.

## Responsividade e usabilidade

- Layout adaptado para tablet e celular (cardápio em colunas automáticas, carrinho em coluna única em telas menores).
- Cabeçalho igual em todas as páginas e cores padronizadas.
- Feedback visual ao passar o mouse nos botões e cards.
- Confirmação antes de excluir e mensagens para listas vazias.