import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, fontWeights, spacing } from '../theme';

export default function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="construct-outline" size={fontSizes.xxl * 2} color={colors.secondary} />
      <Text style={styles.title}>Em breve</Text>
      <Text style={styles.subtitle}>Esta tela ainda está sendo feita pelo grupo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
