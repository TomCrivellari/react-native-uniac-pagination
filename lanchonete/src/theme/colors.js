export const coresClaras = {
  primary: '#E63946',
  primaryDark: '#B82A36',
  secondary: '#FFB703',

  background: '#FFF8F0',
  surface: '#FFFFFF',
  border: '#EADBC8',

  text: '#2B2118',
  textSecondary: '#7A6A5A',
  textOnPrimary: '#FFFFFF',

  success: '#2A9D4B',
  error: '#D62828',
};

// Mesmo vermelho e amarelo da marca; fundo, cards, textos e bordas em tons marrom-escuros
export const coresEscuras = {
  primary: '#E63946',
  primaryDark: '#B82A36',
  secondary: '#FFB703',

  background: '#1A1411',
  surface: '#26201B',
  border: '#3A3029',

  text: '#F5EDE4',
  textSecondary: '#B5A596',
  textOnPrimary: '#FFFFFF',

  success: '#4CC46E',
  error: '#FF6B6B',
};

// Paleta clara fixa: NÃO acompanha a troca de tema. Nas telas, use useTema() / useEstilos()
// (context/TemaContext). Continua exportada só para não quebrar código antigo.
export const colors = coresClaras;
