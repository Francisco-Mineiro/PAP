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

  //Verificar sessão
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
  
  //Verificar sessão (fim)

  //Redirecionar
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

  //Redirecionar(Fim)
 
  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Image 
          source={require('../assets/img/LogoNBG.png')}  
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brandName}>Poupa+</Text>
        <Text style={styles.brandTag}>O controlo que te dá liberdade</Text>

      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.buttonPrimary, pressed && styles.buttonPressed]}
          onPress={() => router.push('/autenticacao/Login')}
        >
          <Ionicons name="log-in-outline" size={21} color="#fff" />
          <Text style={styles.textPrimary}>Entrar na conta</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.buttonSecondary, pressed && styles.buttonPressed]}
          onPress={() => router.push('/autenticacao/Registar')}
        >
          <Ionicons name="person-add-outline" size={21} color={colors.ink} />
          <Text style={styles.textSecondary}>Criar conta</Text>
        </Pressable>

        <View style={styles.dividerContainer}>
         
        </View>
        
        <View style={styles.dividerContainer}>
         
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 28,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  logo: {
    width: 122,
    height: 122,
    marginBottom: 14,
  },
  brandName: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
  },
  brandTag: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '700',
    color: colors.muted,
    textAlign: 'center',
  },
  copyBlock: {
    width: '100%',
    marginTop: 44,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 330,
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
    textDecorationLine: 'underline', 
  },
});
