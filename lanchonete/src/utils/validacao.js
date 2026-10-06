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

export const tamanhoMinimoNome = 3;

export function validarNome(nome) {
  const valor = nome.trim();

  if (!valor) {
    return 'Informe o seu nome.';
  }
  if (valor.length < tamanhoMinimoNome) {
    return `O nome deve ter pelo menos ${tamanhoMinimoNome} caracteres.`;
  }
  return null;
}

export function validarConfirmacaoSenha(senha, confirmacao) {
  if (!confirmacao) {
    return 'Confirme a sua senha.';
  }
  if (senha !== confirmacao) {
    return 'As senhas não conferem.';
  }
  return null;
}