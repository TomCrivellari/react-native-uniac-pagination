import { createContext, useContext, useMemo, useState } from 'react';

import { coresClaras, coresEscuras } from '../theme';

const TemaContext = createContext();

export function TemaProvider({ children }) {
  // O app sempre abre no claro; a escolha do menu lateral vale até recarregar o app
  const [escuro, setEscuro] = useState(false);

  const colors = escuro ? coresEscuras : coresClaras;
  const alternarTema = () => setEscuro((atual) => !atual);

  return (
    <TemaContext.Provider value={{ colors, escuro, alternarTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export const useTema = () => useContext(TemaContext);

// Monta os estilos da tela com as cores do tema atual; só refaz quando o tema muda.
// Uso: const styles = useEstilos(criarEstilos), com function criarEstilos(colors) no fim do arquivo
export function useEstilos(criarEstilos) {
  const { colors } = useTema();
  return useMemo(() => criarEstilos(colors), [colors, criarEstilos]);
}
