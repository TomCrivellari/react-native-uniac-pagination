import { useEstilos, useTema } from '../context/TemaContext';
import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { fontSizes, fontWeights, radius, spacing } from '../theme';

// Aceita todas as props do TextInput (value, onChangeText, keyboardType...).
// Com secureTextEntry, mostra sozinho o botão de mostrar/esconder senha.
// O ref vai para o TextInput, então dá para usar ref.current?.focus() entre campos.
const Input = forwardRef(function Input(
  { label, erro, secureTextEntry = false, style, onFocus, onBlur, ...resto },
  ref
) {
  const { colors, escuro } = useTema();
  const styles = useEstilos(criarEstilos);
  const [emFoco, setEmFoco] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.campo, emFoco && styles.campoFocado, erro && styles.campoErro]}>
        <TextInput
          ref={ref}
          style={[styles.texto, styles.semContorno]}
          placeholderTextColor={colors.textSecondary}
          keyboardAppearance={escuro ? 'dark' : 'light'}
          secureTextEntry={secureTextEntry && !senhaVisivel}
          onFocus={(evento) => {
            setEmFoco(true);
            onFocus?.(evento);
          }}
          onBlur={(evento) => {
            setEmFoco(false);
            onBlur?.(evento);
          }}
          {...resto}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() => setSenhaVisivel(!senhaVisivel)}
            hitSlop={spacing.sm}
            accessibilityRole="button"
            accessibilityLabel={senhaVisivel ? 'Esconder senha' : 'Mostrar senha'}
          >
            <Ionicons
              name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
              size={fontSizes.lg}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
});

export default Input;

function criarEstilos(colors) {
  return StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    campo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + spacing.xs,
    },
    campoFocado: {
      borderColor: colors.primary,
    },
    campoErro: {
      borderColor: colors.error,
    },
    texto: {
      flex: 1,
      padding: 0,
      fontSize: fontSizes.md,
      color: colors.text,
    },
    // No navegador, o foco aparece pela borda (campoFocado) e não pelo contorno padrão
    semContorno: {
      outlineStyle: 'none',
    },
    erro: {
      fontSize: fontSizes.xs,
      color: colors.error,
      marginTop: spacing.xs,
    },
  });
}
