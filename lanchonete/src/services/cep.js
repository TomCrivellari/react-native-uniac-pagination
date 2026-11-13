// consulta de endereço pelo CEP usando a ViaCEP (https://viacep.com.br), não precisa de chave

export function apenasNumeros(cep) {
  return cep.replace(/\D/g, '').slice(0, 8);
}

// "01001000" -> "01001-000", vai formatando enquanto a pessoa digita
export function formatarCep(texto) {
  const numeros = apenasNumeros(texto);
  return numeros.length > 5 ? `${numeros.slice(0, 5)}-${numeros.slice(5)}` : numeros;
}

export async function buscarCep(cep) {
  const numeros = apenasNumeros(cep);

  if (numeros.length !== 8) {
    throw new Error('O CEP precisa ter 8 números.');
  }

  let resposta;
  try {
    resposta = await fetch(`https://viacep.com.br/ws/${numeros}/json/`);
  } catch {
    throw new Error('Sem conexão pra consultar o CEP.');
  }

  if (!resposta.ok) {
    throw new Error('Não deu pra consultar o CEP agora.');
  }

  const dados = await resposta.json();

  // quando o CEP tem 8 números mas não existe, a ViaCEP responde 200 com { erro: "true" }
  if (dados.erro) {
    throw new Error('CEP não encontrado.');
  }

  return {
    cep: dados.cep,
    rua: dados.logradouro,
    bairro: dados.bairro,
    cidade: dados.localidade,
    uf: dados.uf,
  };
}
