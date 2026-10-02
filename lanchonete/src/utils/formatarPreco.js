// Formata um número como preço em reais. Ex.: 12.5 -> "R$ 12,50"
export function formatarPreco(valor) {
  return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}