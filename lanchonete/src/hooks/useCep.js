import { useRef, useState } from 'react';

import { apenasNumeros, buscarCep, formatarCep } from '../services/cep';

// campo de CEP que busca sozinho quando a pessoa termina de digitar os 8 números.
// aoEncontrar recebe { cep, rua, bairro, cidade, uf } pra tela preencher os outros campos
export function useCep(aoEncontrar) {
  const [cep, setCep] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState(null);
  const [encontrado, setEncontrado] = useState(null);
  // o último CEP pesquisado, pra ignorar resposta atrasada de um CEP que já foi apagado
  const ultimaBusca = useRef('');

  async function alterarCep(texto) {
    const formatado = formatarCep(texto);
    const numeros = apenasNumeros(formatado);

    setCep(formatado);
    setErro(null);

    if (numeros.length < 8) {
      ultimaBusca.current = '';
      setEncontrado(null);
      setBuscando(false);
      return;
    }

    if (numeros === ultimaBusca.current) {
      return;
    }

    ultimaBusca.current = numeros;
    setBuscando(true);

    try {
      const endereco = await buscarCep(numeros);
      if (ultimaBusca.current !== numeros) {
        return;
      }
      setEncontrado(endereco);
      aoEncontrar?.(endereco);
    } catch (e) {
      if (ultimaBusca.current === numeros) {
        setErro(e.message);
      }
    } finally {
      if (ultimaBusca.current === numeros) {
        setBuscando(false);
      }
    }
  }

  function limparCep() {
    ultimaBusca.current = '';
    setCep('');
    setErro(null);
    setEncontrado(null);
    setBuscando(false);
  }

  return { cep, alterarCep, limparCep, buscando, erro, encontrado };
}
