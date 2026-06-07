import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert,StyleSheet, SafeAreaView,Keyboard,TouchableWithoutFeedback, ActivityIndicator, KeyboardAvoidingView, Platform, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { account } from '../../src/appwrite'; 
import { colors, shadows, radius } from '../../src/theme';

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
            <Text style={styles.eyebrow}>Bem-vindo de volta</Text>
            <Text style={styles.title}>Entrar na Poupa+</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.faint}
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
                placeholderTextColor={colors.faint}
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
                  color={colors.muted}
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
    backgroundColor: colors.background,
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
    fontSize: 30,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 34,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    height: 54,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadows.soft,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadows.soft,
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
    backgroundColor: colors.primary,
    height: 54,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: colors.primary,
    ...shadows.card,
  },
  buttonDisabled: {
    backgroundColor: colors.faint,
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
    color: colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  backButton: {
    alignItems: 'center',
  },
  backText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});
