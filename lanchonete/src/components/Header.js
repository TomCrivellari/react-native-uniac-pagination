import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useEstilos, useTema } from '../context/TemaContext';
import { fontSizes, fontWeights, radius, spacing } from '../theme';

/**
 * Cabeçalho de seção dentro de uma tela: ícone, título e subtítulo.
 * (O cabeçalho vermelho de navegação é do React Navigation; este fica no corpo da tela.)
 *
 * - titulo: texto principal
 * - subtitulo: texto de apoio. Opcional.
 * - icone: nome de um Ionicons. Opcional.
 */
export default function Header({ titulo, subtitulo, icone, style }) {
  const { colors } = useTema();
  const styles = useEstilos(criarEstilos);

  return (
    <View style={[styles.container, style]} accessibilityRole="header">
      {icone && (
        <View style={styles.icone}>
          <Ionicons name={icone} size={fontSizes.xl} color={colors.textOnPrimary} />
        </View>
      )}
      <View style={styles.textos}>
        <Text style={styles.titulo}>{titulo}</Text>
        {subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
      </View>
    </View>
  );
}

function criarEstilos(colors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    icone: {
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      padding: spacing.sm,
    },
    textos: {
      flex: 1,
    },
    titulo: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    subtitulo: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
      marginTop: spacing.xs / 2,
    },
  });
}
