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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { colors, shadows, radius } from '../../src/theme';

import { account, ID } from '../../src/appwrite';

export default function TestAppwrite() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const register = async () => {
    if (!email || !password || !name) {
      Alert.alert('Erro', 'Por favor preenche todos os campos');
      return;
    }

    try {
      const response = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      console.log('User registered successfully:', response);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');

      setEmail('');
      setPassword('');
      setName('');
      Keyboard.dismiss();
      
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
    }
  };

  const Voltar = async () => {
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
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.faint}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color={colors.muted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={register} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Criar conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={Voltar} activeOpacity={0.85}>
            <Text style={styles.secondaryButtonText}>Voltar</Text>
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
