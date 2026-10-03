import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSizes, fontWeights, radius, spacing } from '../theme';

// variante: 'primario' (vermelho cheio) ou 'secundario' (contorno vermelho)
export default function Button({
  titulo,
  onPress,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
  style,
}) {
  const secundario = variante === 'secundario';
  const bloqueado = desabilitado || carregando;

  return (
    <Pressable
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityState={{ disabled: bloqueado, busy: carregando }}
      style={({ pressed }) => [
        styles.base,
        secundario ? styles.secundario : styles.primario,
        pressed && (secundario ? styles.secundarioPressionado : styles.primarioPressionado),
        bloqueado && styles.bloqueado,
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={secundario ? colors.primary : colors.textOnPrimary} />
      ) : (
        <Text style={[styles.texto, secundario ? styles.textoSecundario : styles.textoPrimario]}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primario: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  primarioPressionado: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  secundario: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },
  secundarioPressionado: {
    backgroundColor: colors.background,
  },
  bloqueado: {
    opacity: 0.7,
  },
  texto: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
  textoPrimario: {
    color: colors.textOnPrimary,
  },
  textoSecundario: {
    color: colors.primary,
  },
});
