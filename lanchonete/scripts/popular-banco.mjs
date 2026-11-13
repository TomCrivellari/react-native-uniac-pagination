// joga o cardápio de src/data/produtos.js no firestore: npm run popular-banco
// pode rodar de novo sem medo, os ids são os mesmos do arquivo então só sobrescreve.
// ele não apaga nada: se tiver documento no banco que não está mais no arquivo, só avisa
// obs: só grava enquanto o banco estiver em modo de teste

import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, writeBatch } from 'firebase/firestore';

import { categorias, produtos } from '../src/data/produtos.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCmmB1-HsBCBpxoAJ2jSgXG0xJOfR1XKaw',
  authDomain: 'devmobileuniac.firebaseapp.com',
  projectId: 'devmobileuniac',
  storageBucket: 'devmobileuniac.firebasestorage.app',
  messagingSenderId: '426358270428',
  appId: '1:426358270428:web:2732ab5b68990f9cf48719',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sincronizar(nomeColecao, itens, montar) {
  const lote = writeBatch(db);
  itens.forEach((item) => lote.set(doc(db, nomeColecao, String(item.id)), montar(item)));
  await lote.commit();

  const ids = new Set(itens.map((item) => String(item.id)));
  const noBanco = await getDocs(collection(db, nomeColecao));
  const sobrando = noBanco.docs.map((documento) => documento.id).filter((id) => !ids.has(id));

  if (sobrando.length > 0) {
    console.log(`"${nomeColecao}" tem documentos que não estão no arquivo: ${sobrando.join(', ')}`);
  }
}

async function popular() {
  await sincronizar('categorias', categorias, (categoria) => ({
    nome: categoria.nome,
    ordem: categoria.id,
  }));

  await sincronizar('produtos', produtos, ({ id, ...produto }) => produto);
}

// se o banco não existir o firebase fica tentando pra sempre, então desiste depois de 30s
const limite = new Promise((_, rejeitar) =>
  setTimeout(() => rejeitar(new Error('demorou demais, o firestore foi criado no console?')), 30000),
);

try {
  await Promise.race([popular(), limite]);
  console.log(`Pronto: ${categorias.length} categorias e ${produtos.length} produtos no banco.`);
  process.exit(0);
} catch (erro) {
  console.error('Falha ao popular o banco:', erro.message);
  process.exit(1);
}
