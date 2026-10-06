import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { useTema } from '../context/TemaContext';
import RootNavigator from './RootNavigator';

/**
 * Container da navegação com as cores do tema atual. O React Navigation usa essas cores nos
 * fundos e textos padrão (telas, menu lateral, barra de abas) quando a tela não define a sua.
 */
export default function Navegacao() {
  const { colors, escuro } = useTema();
  const base = escuro ? DarkTheme : DefaultTheme;

  const temaNavegacao = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={temaNavegacao}>
      <RootNavigator />
    </NavigationContainer>
  );
}
