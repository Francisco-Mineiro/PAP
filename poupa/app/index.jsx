import { View, Text, Pressable, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { account } from '../src/appwrite'; 
import { colors, shadows, radius } from '../src/theme';

export default function EntryScreen() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setCheckingSession(false);
      }
    };

    checkAuth();
  }, []);


  if (isLoggedIn) {
    return <Redirect href="/barra/Home" replace />;
  }

  if (checkingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>A verificar...</Text>
      </View>
    );
  }

 
  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.brandRow}>
          <Image 
            source={require('../assets/img/LogoNBG.png')}  
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.brandName}>Poupa+</Text>
            <Text style={styles.brandTag}>Finanças simples</Text>
          </View>
        </View>

        <Text style={styles.title}>Controla o teu dinheiro com mais calma.</Text>
        <Text style={styles.subtitle}>Acompanha despesas, limites e decisões num espaço feito para ser claro.</Text>

        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View>
              <Text style={styles.previewLabel}>Resumo mensal</Text>
              <Text style={styles.previewValue}>570€</Text>
            </View>
            <View style={styles.previewIcon}>
              <Ionicons name="trending-up" size={24} color={colors.accent} />
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.previewFooter}>
            <View>
              <Text style={styles.metricLabel}>Gasto</Text>
              <Text style={styles.metricValue}>65%</Text>
            </View>
            <View style={styles.metricRight}>
              <Text style={styles.metricLabel}>Orçamento</Text>
              <Text style={styles.metricValue}>1.620€</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.buttonPrimary, pressed && styles.buttonPressed]}
          onPress={() => router.push('/autenticacao/Registar')}
        >
          <Ionicons name="person-add-outline" size={20} color="#fff" />
          <Text style={styles.textPrimary}>Criar conta</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.buttonSecondary, pressed && styles.buttonPressed]}
          onPress={() => router.push('/autenticacao/Login')}
        >
          <Ionicons name="log-in-outline" size={20} color={colors.ink} />
          <Text style={styles.textSecondary}>Entrar na conta</Text>
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          style={({ pressed }) => [styles.buttonGuest, pressed && styles.buttonPressed]}
          onPress={() => router.push('/barra/Home')}
        >
          <Text style={styles.textGuest}>Continuar sem conta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingBottom: 26,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.muted,
    fontWeight: '500',
  },
  hero: {
    width: '100%',
    paddingTop: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 34,
  },
  logo: {
    width: 66,
    height: 66,
    marginRight: 12,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.ink,
  },
  brandTag: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.ink,
    marginBottom: 12,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    lineHeight: 24,
    marginBottom: 28,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  previewLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  previewValue: {
    color: colors.ink,
    fontSize: 36,
    fontWeight: '900',
    marginTop: 4,
  },
  previewIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e8eef5',
    overflow: 'hidden',
    marginBottom: 18,
  },
  progressFill: {
    width: '65%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricRight: {
    alignItems: 'flex-end',
  },
  metricLabel: {
    color: colors.faint,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
  },
  buttonContainer: {
    width: '100%',
    gap: 12, 
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }], 
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: colors.primary,
    ...shadows.soft,
  },
  textPrimary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  textSecondary: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.faint,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonGuest: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  textGuest: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline', // Transforma o botão "Convidado" num link limpo
  },
});
