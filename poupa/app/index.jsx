import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { account } from '../src/appwrite'; 

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
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>A verificar...</Text>
      </View>
    );
  }

 
  return (

    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoMock}>
          

      <Image 
        source={require('../assets/img/LogoNBG.png')}  
        style={styles.logo}
        resizeMode="contain"
      />




        </View>
        <Text style={styles.title}>Poupa+</Text>
        <Text style={styles.subtitle}>O controlo que te dá liberdade.</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.buttonPrimary, pressed && styles.buttonPressed]}
          onPress={() => router.push('/autenticacao/Registar')}
        >
          <Text style={styles.textPrimary}>Criar conta </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.buttonSecondary, pressed && styles.buttonPressed]}
          onPress={() => router.push('/autenticacao/Login')}
        >
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  headerContainer: {
    alignItems: 'center',
    width: '100%',
  },
    logo: {
    width: 231,
    height: 231,
 
  },
  logoMock: {
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
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
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  textPrimary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  textSecondary: {
    color: '#0f172a',
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
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#94a3b8',
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
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline', // Transforma o botão "Convidado" num link limpo
  },
});