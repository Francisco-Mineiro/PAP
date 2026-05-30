import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

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
          <Text style={styles.title}>Registrar </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
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
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <Button title="Registrar Nova Conta" onPress={register} />

          <Button title="Voltar" onPress={Voltar} color="#ff4444" />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
});