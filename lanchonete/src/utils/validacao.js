const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const tamanhoMinimoSenha = 6;

// Cada função devolve a mensagem de erro, ou null quando o valor é válido
export function validarEmail(email) {
  const valor = email.trim();

  if (!valor) {
    return 'Informe o seu e-mail.';
  }
  if (!formatoEmail.test(valor)) {
    return 'Digite um e-mail válido.';
  }
  return null;
}

export function validarSenha(senha) {
  if (!senha) {
    return 'Informe a sua senha.';
  }
  if (senha.length < tamanhoMinimoSenha) {
    return `A senha deve ter pelo menos ${tamanhoMinimoSenha} caracteres.`;
  }
  return null;
}
