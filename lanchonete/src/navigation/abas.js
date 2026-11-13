/**
 * Abas da área logada, numa lista só.
 *
 * A barra de abas (MainTabs), o menu lateral (DrawerContent) e o título do cabeçalho (AppDrawer)
 * leem daqui, assim os dois menus mostram sempre os mesmos destinos, nomes e ícones.
 *
 * `icone` é o nome do Ionicons sem o sufixo: a versão "-outline" aparece quando a aba não está ativa.
 */
export const abas = [
  { nome: 'Home', titulo: 'Início', icone: 'home' },
  { nome: 'Busca', titulo: 'Buscar', icone: 'search' },
  { nome: 'Carrinho', titulo: 'Carrinho', icone: 'cart' },
  { nome: 'Pedidos', titulo: 'Meus pedidos', icone: 'receipt' },
  { nome: 'Perfil', titulo: 'Perfil', icone: 'person' },
];

export const abaInicial = abas[0].nome;

export function tituloDaAba(nome) {
  return abas.find((aba) => aba.nome === nome)?.titulo;
}

export function iconeDaAba(nome, ativo) {
  const { icone } = abas.find((aba) => aba.nome === nome);
  return ativo ? icone : `${icone}-outline`;
}
