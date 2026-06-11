import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { colors, shadows, radius } from '../../src/theme';

import { account, ID } from '../../src/appwrite';
import { useFinance } from '../../src/FinanceContext';

export default function TestAppwrite() {
  const router = useRouter();
  const { refreshFinanceData, resetFinanceState } = useFinance();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!email.trim() || !password || !name.trim()) {
      Alert.alert('Erro', 'Por favor preenche todos os campos');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Erro', 'A password tem de ter pelo menos 8 caracteres.');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      await account.create(ID.unique(), email.trim(), password, name.trim());
      await account.createEmailPasswordSession(email.trim(), password);

      setEmail('');
      setPassword('');
      setName('');
      setShowPassword(false);

      await refreshFinanceData();
      router.replace('barra/Home');
    } catch (error) {
      console.error('Registration error:', error);

      let errorMessage = 'Erro desconhecido.';

      if (error.code === 409) {
        errorMessage = 'Esse email já está a ser usado.';
      } else if (error.code === 400) {
        errorMessage = 'A password tem de ter pelo menos 8 caracteres.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };
const gotoLogin = () => {
    router.push('autenticacao/Login'); 
  };
  const Voltar = async () => {
  try {
    await account.get();
    resetFinanceState();
    await account.deleteSession('current');
    console.log('Logout successful');
  } catch (error) {
    console.log('No session or error during logout:', error);
    resetFinanceState();
  } finally {
 router.replace('/');

   
  }
};



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>Começa hoje</Text>
          <Text style={styles.title}>Criar conta</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor={colors.faint}
            value={name}
            onChangeText={setName}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.faint}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor={colors.faint}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
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
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={register}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={Voltar} activeOpacity={0.85} disabled={loading}>
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
          
                     <View style={styles.dividerContainer}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>ou</Text>
                      <View style={styles.dividerLine} />
                    </View>

          <TouchableOpacity onPress={gotoLogin}>
                <Text style={styles.textGuest}>Entrar na conta</Text>
              </TouchableOpacity>
            </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 34,
    color: colors.ink,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    color: colors.primary,
  },
  textGuest: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: 20,
    backgroundColor: colors.surface,
    ...shadows.soft,
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
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginBottom: 20,
    ...shadows.soft,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  primaryButton: {
    width: '100%',
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    ...shadows.card,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '800',
  },
  primaryButtonDisabled: {
    backgroundColor: colors.faint,
  },
  secondaryButton: {
    width: '100%',
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '700',
  },
});
