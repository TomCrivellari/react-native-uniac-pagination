import { Platform } from 'react-native';

// taxa de entrega pela distância. usa duas APIs do OpenStreetMap, as duas grátis e sem chave:
// - Nominatim: transforma o endereço em latitude/longitude
// - OSRM: calcula o caminho de carro entre a lanchonete e o cliente

// a lanchonete fica na UniAcademia. se mudar de lugar é só trocar aqui
// (latitude e longitude dá pra pegar no google maps, clicando com o botão direito no lugar)
export const lanchonete = {
  endereco: 'Rua Halfeld, 1179 - Centro, Juiz de Fora/MG',
  cidade: 'Juiz de Fora',
  uf: 'MG',
  latitude: -21.7619364,
  longitude: -43.3522668,
};

export const regras = {
  porKm: 2,
  taxaMinima: 5,
  raioMaximoKm: 10,
};

// a rua nunca é reta, então quando só dá pra medir em linha reta a gente põe uma folga
const folgaLinhaReta = 1.3;

// o Nominatim pede no máximo 1 consulta por segundo
const intervaloNominatim = 1100;

// guarda o que já foi encontrado pra não consultar o mesmo endereço de novo
const jaLocalizados = new Map();

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

// no navegador não dá pra mudar o User-Agent, mas no celular o Nominatim pede que o app se identifique
const cabecalhos = Platform.OS === 'web' ? {} : { 'User-Agent': 'Fomegao/1.0 (trabalho academico)' };

async function consultarNominatim(parametros) {
  const busca = new URLSearchParams({
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'br',
    'accept-language': 'pt-BR',
    ...parametros,
  });

  const resposta = await fetch(`https://nominatim.openstreetmap.org/search?${busca}`, {
    headers: cabecalhos,
  });

  if (!resposta.ok) {
    throw new Error(`nominatim respondeu ${resposta.status}`);
  }

  const [lugar] = await resposta.json();
  return lugar ? { latitude: Number(lugar.lat), longitude: Number(lugar.lon) } : null;
}

// um quadrado de uns 25 km pra cada lado da lanchonete
const perto = {
  viewbox: [
    lanchonete.longitude - 0.25,
    lanchonete.latitude + 0.25,
    lanchonete.longitude + 0.25,
    lanchonete.latitude - 0.25,
  ].join(','),
  bounded: '1',
};

// tenta do jeito mais certeiro pro mais genérico, até o mapa achar alguma coisa.
// primeiro procura só perto da lanchonete, porque nome de rua repete muito
// (sem isso "Rua Augusta, 500" caía em Sumaré). se não achar, procura no país todo,
// assim um endereço de outra cidade ainda aparece como fora da área
export async function localizar({ rua, bairro, cidade, uf, cep }) {
  const cidadeFinal = cidade || lanchonete.cidade;
  const ufFinal = uf || lanchonete.uf;

  const tentativas = [
    { ...perto, street: rua, city: cidadeFinal },
    { ...perto, q: [rua, bairro, cidadeFinal].filter(Boolean).join(', ') },
    { street: rua, city: cidadeFinal, state: ufFinal },
    cep && { postalcode: cep },
    bairro && { q: `${bairro}, ${cidadeFinal}, ${ufFinal}` },
  ].filter(Boolean);

  const chave = JSON.stringify(tentativas);
  if (jaLocalizados.has(chave)) {
    return jaLocalizados.get(chave);
  }

  for (const [indice, parametros] of tentativas.entries()) {
    if (indice > 0) {
      await esperar(intervaloNominatim);
    }

    const lugar = await consultarNominatim(parametros);
    if (lugar) {
      jaLocalizados.set(chave, lugar);
      return lugar;
    }
  }

  return null;
}

async function distanciaDeCarro(origem, destino) {
  const pontos = `${origem.longitude},${origem.latitude};${destino.longitude},${destino.latitude}`;
  const resposta = await fetch(`https://router.project-osrm.org/route/v1/driving/${pontos}?overview=false`);
  const dados = await resposta.json();

  if (dados.code !== 'Ok' || !dados.routes?.length) {
    throw new Error('osrm não achou caminho');
  }

  return dados.routes[0].distance / 1000;
}

// fórmula de haversine: distância entre dois pontos do globo, em km
function distanciaEmLinhaReta(a, b) {
  const raioDaTerra = 6371;
  const paraRadianos = (graus) => (graus * Math.PI) / 180;

  const dLat = paraRadianos(b.latitude - a.latitude);
  const dLon = paraRadianos(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(paraRadianos(a.latitude)) * Math.cos(paraRadianos(b.latitude)) * Math.sin(dLon / 2) ** 2;

  return 2 * raioDaTerra * Math.asin(Math.sqrt(h));
}

export function taxaPelaDistancia(distanciaKm) {
  return Math.max(regras.taxaMinima, Math.ceil(distanciaKm * regras.porKm));
}

// endereco: { rua, bairro, cidade, uf, cep }, só a rua é obrigatória
// devolve { distanciaKm, taxa, foraDaArea }
export async function calcularEntrega(endereco) {
  const destino = await localizar(endereco);

  if (!destino) {
    throw new Error('Não achamos esse endereço no mapa.');
  }

  let distanciaKm;
  try {
    distanciaKm = await distanciaDeCarro(lanchonete, destino);
  } catch {
    distanciaKm = distanciaEmLinhaReta(lanchonete, destino) * folgaLinhaReta;
  }

  return {
    distanciaKm,
    taxa: taxaPelaDistancia(distanciaKm),
    foraDaArea: distanciaKm > regras.raioMaximoKm,
  };
}

export function formatarDistancia(km) {
  return `${km.toFixed(1).replace('.', ',')} km`;
}
