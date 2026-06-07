import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { account } from '../../src/appwrite';
import { colors, radius, shadows } from '../../src/theme';

export default function EditarPerfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialEmail, setInitialEmail] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentUser = await account.get();
        setName(currentUser.name || '');
        setEmail(currentUser.email || '');
        setInitialEmail(currentUser.email || '');
      } catch (error) {
        console.log('Erro ao carregar perfil:', error);
        Alert.alert('Erro', 'Não foi possível carregar o perfil.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const emailChanged = cleanEmail !== initialEmail;

    if (!cleanName || !cleanEmail) {
      Alert.alert('Erro', 'Preenche o nome e o email.');
      return;
    }

    if (emailChanged && !password) {
      Alert.alert('Password necessária', 'Para alterar o email, escreve a tua password atual.');
      return;
    }

    try {
      setSaving(true);
      await account.updateName(cleanName);

      if (emailChanged) {
        await account.updateEmail(cleanEmail, password);
        setInitialEmail(cleanEmail);
        setPassword('');
      }

      Alert.alert('Perfil atualizado', 'As alterações foram guardadas.');
    } catch (error) {
      console.log('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.replace('barra/conta')} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.ink} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Editar Perfil</Text>
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : 'U'}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="O teu nome"
                placeholderTextColor={colors.faint}
                editable={!loading && !saving}
              />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@exemplo.com"
                placeholderTextColor={colors.faint}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading && !saving}
              />

              {email.trim() !== initialEmail && (
                <>
                  <Text style={styles.inputLabel}>Password atual</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Necessária para alterar email"
                    placeholderTextColor={colors.faint}
                    secureTextEntry
                    editable={!saving}
                  />
                </>
              )}

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={loading || saving}
              >
                <Text style={styles.saveButtonText}>{saving ? 'A guardar...' : 'Guardar alterações'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  backButton: {
    marginRight: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.ink,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    ...shadows.card,
  },
  avatarText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    ...shadows.soft,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    padding: 14,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 18,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
