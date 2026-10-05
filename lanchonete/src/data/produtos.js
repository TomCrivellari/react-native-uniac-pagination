export const categorias = [
  {
    id: 1,
    nome: 'Hambúrgueres',
  },
  {
    id: 2,
    nome: 'Combos',
  },
  {
    id: 3,
    nome: 'Hot Dogs',
  },
  {
    id: 4,
    nome: 'Porções',
  },
  {
    id: 5,
    nome: 'Sanduíches',
  },
  {
    id: 6,
    nome: 'Bebidas',
  },
  {
    id: 7,
    nome: 'Sobremesas',
  },
  {
    id: 8,
    nome: 'Molhos e Adicionais',
  },
];

export const produtos = [
  {
    id: 1,
    categoriaId: 1,
    nome: 'X-Burger',
    preco: 18.90,
    foto: 'img/xburguer.jpg',
    descricao: 'Pão, hambúrguer artesanal, queijo e molho especial.',
    adicionais: [
      {
        id: 101,
        nome: 'Bacon',
        preco: 4.00,
      },
      {
        id: 102,
        nome: 'Queijo extra',
        preco: 3.00,
      },
      {
        id: 103,
        nome: 'Ovo',
        preco: 2.50,
      },
    ],
    disponivel: true,
  },

  {
    id: 2,
    categoriaId: 1,
    nome: 'X-Salada',
    preco: 21.90,
    foto: 'img/xsalada.jpg',
    descricao: 'Pão, hambúrguer artesanal, queijo, alface, tomate e molho especial.',
    adicionais: [
      {
        id: 201,
        nome: 'Bacon',
        preco: 4.00,
      },
      {
        id: 202,
        nome: 'Queijo extra',
        preco: 3.00,
      },
      {
        id: 203,
        nome: 'Hambúrguer extra',
        preco: 7.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 3,
    categoriaId: 1,
    nome: 'X-Bacon',
    preco: 24.90,
    foto: 'img/xbacon.jpg',
    descricao: 'Pão, hambúrguer artesanal, queijo, bacon crocante e molho especial.',
    adicionais: [
      {
        id: 301,
        nome: 'Bacon extra',
        preco: 4.00,
      },
      {
        id: 302,
        nome: 'Queijo extra',
        preco: 3.00,
      },
      {
        id: 303,
        nome: 'Hambúrguer extra',
        preco: 7.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 4,
    categoriaId: 1,
    nome: 'X-Tudo',
    preco: 29.90,
    foto: 'img/xtudo.jpg',
    descricao: 'Pão, hambúrguer, queijo, presunto, bacon, ovo, alface, tomate e molho especial.',
    adicionais: [
      {
        id: 401,
        nome: 'Bacon extra',
        preco: 4.00,
      },
      {
        id: 402,
        nome: 'Queijo extra',
        preco: 3.00,
      },
      {
        id: 403,
        nome: 'Hambúrguer extra',
        preco: 7.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 5,
    categoriaId: 2,
    nome: 'Combo X-Burger',
    preco: 29.90,
    foto: 'img/xburguer-combo.jpg',
    descricao: 'X-Burger acompanhado de batata frita e refrigerante lata.',
    adicionais: [
      {
        id: 501,
        nome: 'Batata grande',
        preco: 5.00,
      },
      {
        id: 502,
        nome: 'Refrigerante 600ml',
        preco: 4.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 6,
    categoriaId: 2,
    nome: 'Combo X-Bacon',
    preco: 35.90,
    foto: 'img/xbacon-combo.jpg',
    descricao: 'X-Bacon acompanhado de batata frita e refrigerante lata.',
    adicionais: [
      {
        id: 601,
        nome: 'Batata grande',
        preco: 5.00,
      },
      {
        id: 602,
        nome: 'Refrigerante 600ml',
        preco: 4.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 7,
    categoriaId: 3,
    nome: 'Hot Dog Tradicional',
    preco: 15.90,
    foto: 'img/hotdog.jpg',
    descricao: 'Pão de hot dog, duas salsichas, molho, milho, batata palha e ketchup.',
    adicionais: [
      {
        id: 701,
        nome: 'Queijo',
        preco: 3.00,
      },
      {
        id: 702,
        nome: 'Bacon',
        preco: 4.00,
      },
      {
        id: 703,
        nome: 'Salsicha extra',
        preco: 3.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 8,
    categoriaId: 3,
    nome: 'Hot Dog Completo',
    preco: 21.90,
    foto: 'img/hotdog-completo.jpg',
    descricao: 'Pão de hot dog, salsicha, queijo, bacon, milho, batata palha e molhos.',
    adicionais: [
      {
        id: 801,
        nome: 'Queijo extra',
        preco: 3.00,
      },
      {
        id: 802,
        nome: 'Bacon extra',
        preco: 4.00,
      },
      {
        id: 803,
        nome: 'Salsicha extra',
        preco: 3.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 9,
    categoriaId: 4,
    nome: 'Batata Frita',
    preco: 16.90,
    foto: 'img/batataFrita.jpg',
    descricao: 'Porção de batatas fritas crocantes.',
    adicionais: [
      {
        id: 901,
        nome: 'Cheddar',
        preco: 5.00,
      },
      {
        id: 902,
        nome: 'Bacon',
        preco: 4.00,
      },
      {
        id: 903,
        nome: 'Cheddar e bacon',
        preco: 8.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 10,
    categoriaId: 4,
    nome: 'Nuggets',
    preco: 18.90,
    foto: 'img/nuggets.jpg',
    descricao: 'Porção com 10 unidades de nuggets de frango.',
    adicionais: [
      {
        id: 1001,
        nome: 'Molho especial',
        preco: 2.00,
      },
      {
        id: 1002,
        nome: 'Cheddar',
        preco: 5.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 11,
    categoriaId: 5,
    nome: 'Misto Quente',
    preco: 12.90,
    foto: 'img/mistoQuente.jpg',
    descricao: 'Pão, presunto e queijo, preparado na chapa.',
    adicionais: [
      {
        id: 1101,
        nome: 'Queijo extra',
        preco: 3.00,
      },
      {
        id: 1102,
        nome: 'Presunto extra',
        preco: 3.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 12,
    categoriaId: 5,
    nome: 'Sanduíche de Frango',
    preco: 19.90,
    foto: 'img/sanduicheFrango.jpg',
    descricao: 'Pão, frango desfiado, queijo, alface, tomate e molho especial.',
    adicionais: [
      {
        id: 1201,
        nome: 'Bacon',
        preco: 4.00,
      },
      {
        id: 1202,
        nome: 'Queijo extra',
        preco: 3.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 13,
    categoriaId: 6,
    nome: 'Refrigerante Lata',
    preco: 6.00,
    foto: 'img/refrigerantes.jpg',
    descricao: 'Refrigerante em lata de 350ml.',
    adicionais: [],
    disponivel: true,
  },

  {
    id: 14,
    categoriaId: 6,
    nome: 'Refrigerante 600ml',
    preco: 8.00,
    foto: 'img/refrigerantes-600ml.jpg',
    descricao: 'Refrigerante em garrafa de 600ml.',
    adicionais: [],
    disponivel: true,
  },

  {
    id: 15,
    categoriaId: 6,
    nome: 'Suco Natural',
    preco: 9.90,
    foto: 'img/sucos.jpg',
    descricao: 'Suco natural preparado na hora.',
    adicionais: [
      {
        id: 1501,
        nome: 'Acréscimo de fruta',
        preco: 2.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 16,
    categoriaId: 6,
    nome: 'Água Mineral',
    preco: 4.00,
    foto: 'img/agua.jpg',
    descricao: 'Água mineral sem gás, 500ml.',
    adicionais: [],
    disponivel: true,
  },

  {
    id: 17,
    categoriaId: 7,
    nome: 'Brownie',
    preco: 9.90,
    foto: 'img/brownie.jpg',
    descricao: 'Brownie de chocolate com textura macia.',
    adicionais: [
      {
        id: 1701,
        nome: 'Sorvete',
        preco: 5.00,
      },
      {
        id: 1702,
        nome: 'Calda de chocolate',
        preco: 3.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 18,
    categoriaId: 7,
    nome: 'Milkshake de Chocolate',
    preco: 16.90,
    foto: 'img/milkshake.jpg',
    descricao: 'Milkshake cremoso de chocolate.',
    adicionais: [
      {
        id: 1801,
        nome: 'Chantilly',
        preco: 2.00,
      },
      {
        id: 1802,
        nome: 'Ovomaltine',
        preco: 3.00,
      },
    ],
    disponivel: true,
  },

  {
    id: 19,
    categoriaId: 8,
    nome: 'Molho Especial',
    preco: 2.50,
    foto: 'img/molho.jpg',
    descricao: 'Maionese especial da casa.',
    adicionais: [],
    disponivel: true,
  },

  {
    id: 20,
    categoriaId: 8,
    nome: 'Combo de 3 molhos',
    preco: 5.00,
    foto: 'img/barbecue.jpg',
    descricao: 'Molhos especiais: Maionese, Barbecue e Mostarda.',
    adicionais: [],
    disponivel: true,
  },
];