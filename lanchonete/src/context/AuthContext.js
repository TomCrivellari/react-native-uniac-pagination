import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// E-mail sem espaços e em minúsculas, para "Maria@Email.com " e "maria@email.com" serem a mesma conta
const normalizarEmail = (email) => email.trim().toLowerCase();

export function AuthProvider({ children }) {
  // Contas criadas no Cadastro. Não há back-end: ficam só na memória e somem ao recarregar o app
  const [contas, setContas] = useState([]);
  // Conta logada ({ nome, email }), ou null
  const [usuario, setUsuario] = useState(null);

  // Endereços da conta logada (cadastrados no Perfil, escolhidos no Checkout)
  const enderecos = contas.find((c) => c.email === usuario?.email)?.enderecos ?? [];

  // Devolve a mensagem de erro, ou null quando a conta foi criada (igual às funções de utils/validacao)
  function criarConta({ nome, email, senha }) {
    const emailNormalizado = normalizarEmail(email);

    if (contas.some((c) => c.email === emailNormalizado)) {
      return 'Já existe uma conta com este e-mail.';
    }

    setContas((atuais) => [
      ...atuais,
      { nome: nome.trim(), email: emailNormalizado, senha, enderecos: [] },
    ]);
    return null;
  }

  // Devolve { campo, mensagem } para o Login mostrar no campo certo, ou null quando entrou
  function fazerLogin(email, senha) {
    const conta = contas.find((c) => c.email === normalizarEmail(email));

    if (!conta) {
      return {
        campo: 'email',
        mensagem: 'Não encontramos uma conta com este e-mail. Crie uma conta.',
      };
    }
    if (conta.senha !== senha) {
      return { campo: 'senha', mensagem: 'Senha incorreta.' };
    }

    setUsuario({ nome: conta.nome, email: conta.email });
    return null;
  }

  const fazerLogout = () => setUsuario(null);

  // Troca os endereços só da conta logada; as outras contas ficam como estão
  function alterarEnderecos(alterar) {
    if (!usuario) {
      return;
    }
    setContas((atuais) =>
      atuais.map((c) => (c.email === usuario.email ? { ...c, enderecos: alterar(c.enderecos) } : c))
    );
  }

  function adicionarEndereco({ apelido, rua, bairro }) {
    alterarEnderecos((atuais) => [
      ...atuais,
      { id: Date.now(), apelido: apelido.trim(), rua: rua.trim(), bairro: bairro.trim() },
    ]);
  }

  function removerEndereco(id) {
    alterarEnderecos((atuais) => atuais.filter((endereco) => endereco.id !== id));
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        enderecos,
        criarConta,
        fazerLogin,
        fazerLogout,
        adicionarEndereco,
        removerEndereco,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
