// joga o cardápio no firestore: npm run popular-banco
// pode rodar de novo sem medo, os ids são fixos então só sobrescreve
// obs: só grava enquanto o banco estiver em modo de teste

import { initializeApp } from 'firebase/app';
import { doc, getFirestore, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCmmB1-HsBCBpxoAJ2jSgXG0xJOfR1XKaw',
  authDomain: 'devmobileuniac.firebaseapp.com',
  projectId: 'devmobileuniac',
  storageBucket: 'devmobileuniac.firebasestorage.app',
  messagingSenderId: '426358270428',
  appId: '1:426358270428:web:2732ab5b68990f9cf48719',
};

// a chave vira o id do documento
const categorias = {
  lanches: { nome: 'Lanches', ordem: 1 },
  porcoes: { nome: 'Porções', ordem: 2 },
  bebidas: { nome: 'Bebidas', ordem: 3 },
  sobremesas: { nome: 'Sobremesas', ordem: 4 },
};

const produtos = {
  'x-burger': {
    nome: 'X-Burger',
    descricao: 'Pão, hambúrguer artesanal 150g, queijo e molho da casa.',
    preco: 19.9,
    categoriaId: 'lanches',
    destaque: false,
  },
  'x-salada': {
    nome: 'X-Salada',
    descricao: 'Pão, hambúrguer 150g, queijo, alface, tomate e maionese.',
    preco: 22.9,
    categoriaId: 'lanches',
    destaque: false,
  },
  'x-bacon': {
    nome: 'X-Bacon',
    descricao: 'Pão, hambúrguer 150g, queijo, bacon crocante e maionese.',
    preco: 26.9,
    categoriaId: 'lanches',
    destaque: true,
  },
  'x-tudo': {
    nome: 'X-Tudo',
    descricao: 'Pão, dois hambúrgueres, queijo, bacon, ovo, presunto, alface e tomate.',
    preco: 34.9,
    categoriaId: 'lanches',
    destaque: true,
  },
  'fomegao-duplo': {
    nome: 'Fomegão Duplo',
    descricao: 'O lanche da casa: dois hambúrgueres 180g, cheddar, cebola caramelizada e bacon.',
    preco: 39.9,
    categoriaId: 'lanches',
    destaque: true,
  },
  'batata-frita': {
    nome: 'Batata frita',
    descricao: 'Porção de batata frita crocante (400g).',
    preco: 18.9,
    categoriaId: 'porcoes',
    destaque: false,
  },
  'batata-cheddar-bacon': {
    nome: 'Batata com cheddar e bacon',
    descricao: 'Batata frita (400g) coberta com cheddar cremoso e bacon.',
    preco: 27.9,
    categoriaId: 'porcoes',
    destaque: true,
  },
  'aneis-cebola': {
    nome: 'Anéis de cebola',
    descricao: 'Porção de anéis de cebola empanados (300g).',
    preco: 21.9,
    categoriaId: 'porcoes',
    destaque: false,
  },
  'refrigerante-lata': {
    nome: 'Refrigerante lata',
    descricao: 'Lata 350ml. Coca-Cola, Guaraná ou Fanta.',
    preco: 6.5,
    categoriaId: 'bebidas',
    destaque: false,
  },
  'suco-natural': {
    nome: 'Suco natural',
    descricao: 'Copo 500ml. Laranja, limão ou maracujá.',
    preco: 9.9,
    categoriaId: 'bebidas',
    destaque: false,
  },
  'agua-mineral': {
    nome: 'Água mineral',
    descricao: 'Garrafa 500ml, com ou sem gás.',
    preco: 4.0,
    categoriaId: 'bebidas',
    destaque: false,
  },
  milkshake: {
    nome: 'Milkshake',
    descricao: 'Copo 400ml. Chocolate, morango ou baunilha.',
    preco: 16.9,
    categoriaId: 'sobremesas',
    destaque: true,
  },
  'brownie-sorvete': {
    nome: 'Brownie com sorvete',
    descricao: 'Brownie de chocolate quentinho com uma bola de sorvete de creme.',
    preco: 14.9,
    categoriaId: 'sobremesas',
    destaque: false,
  },
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function popular() {
  const lote = writeBatch(db);

  for (const [id, dados] of Object.entries(categorias)) {
    lote.set(doc(db, 'categorias', id), dados);
  }

  for (const [id, dados] of Object.entries(produtos)) {
    lote.set(doc(db, 'produtos', id), { imagemUrl: '', disponivel: true, ...dados });
  }

  await lote.commit();
}

// se o banco não existir o firebase fica tentando pra sempre, então desiste depois de 30s
const limite = new Promise((_, rejeitar) =>
  setTimeout(() => rejeitar(new Error('demorou demais, o firestore foi criado no console?')), 30000),
);

try {
  await Promise.race([popular(), limite]);
  console.log(
    `Pronto: ${Object.keys(categorias).length} categorias e ${Object.keys(produtos).length} produtos gravados.`,
  );
  process.exit(0);
} catch (erro) {
  console.error('Falha ao popular o banco:', erro.message);
  process.exit(1);
}
