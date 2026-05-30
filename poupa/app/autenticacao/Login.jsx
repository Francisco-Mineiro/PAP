import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert,StyleSheet, SafeAreaView,Keyboard,TouchableWithoutFeedback, ActivityIndicator, KeyboardAvoidingView, Platform, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { account } from '../../src/appwrite'; 

export default function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, insira o email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Erro', 'Email inválido');
      return false;
    }
    if (!password) {
      Alert.alert('Erro', 'Por favor, insira a senha');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    Keyboard.dismiss();

    try {
      const session = await account.createEmailPasswordSession(email.trim(), password);
      console.log('Sessão criada:', session.userId);

      setEmail('');
      setPassword('');
      setShowPassword(false);

      router.replace('barra/Home');
    } catch (err) {
      console.error('Erro no login:', err);

      let message = 'Falha ao entrar. Tente novamente.';
      if (err.code === 401 || err.type === 'user_invalid_credentials') {
        message = 'Email ou senha incorretos';
      } else if (err.message) {
        message = err.message;
      }

      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  const gotoRegistrar = () => {
    router.push('autenticacao/Registar'); 
  };

  const goToForgotPassword = () => {//não existe ainda
    router.push('/forgot-password'); 
  };

  const handleVoltar = async () => {
  try {
    await account.get(); // 
    await account.deleteSession('current');
    console.log('Logout successful');
  } catch (error) {
    console.log('No session or error during logout:', error);
  } finally {
 router.replace('/');

   
  }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              accessibilityLabel="Endereço de email"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                accessibilityLabel="Senha"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.linkRow}>
              <TouchableOpacity onPress={goToForgotPassword}>
                <Text style={styles.linkText}>Esqueceu a senha?</Text>
                 <Text>ainda não feito</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={gotoRegistrar}>
                <Text style={styles.linkText}>Criar conta</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleVoltar}
              disabled={loading}
            >
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 48,
  },
  input: {
    height: 54,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    height: 54,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#a0c4ff',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '500',
  },
  backButton: {
    alignItems: 'center',
  },
  backText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
});