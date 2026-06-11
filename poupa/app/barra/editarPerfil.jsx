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

const goBackToConta = (router) => {
  router.replace('barra/conta');
};

export default function EditarPerfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [initialEmail, setInitialEmail] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentUser = await account.get();
        setName(currentUser.name || '');
        setEmail(currentUser.email || '');
        setInitialEmail(currentUser.email || '');
        setHasAccount(true);
      } catch (error) {
        console.log('Erro ao carregar perfil:', error);
        setHasAccount(false);
        Alert.alert(
          'Conta necessária',
          'Precisas de criar ou entrar numa conta para editar o perfil.',
          [{ text: 'OK', onPress: () => goBackToConta(router) }]
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleSaveProfile = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const emailChanged = cleanEmail !== initialEmail;

    if (!cleanName || !cleanEmail) {
      Alert.alert('Erro', 'Preenche o nome e o email.');
      return;
    }

    if (emailChanged && !emailPassword) {
      Alert.alert('Password necessária', 'Para alterar o email, escreve a tua password atual.');
      return;
    }

    try {
      setSavingProfile(true);
      await account.updateName(cleanName);

      if (emailChanged) {
        await account.updateEmail(cleanEmail, emailPassword);
        setInitialEmail(cleanEmail);
        setEmailPassword('');
      }

      Alert.alert('Perfil atualizado', 'Nome e email guardados com sucesso.');
    } catch (error) {
      console.log('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil. Verifica a password atual.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Password necessária', 'Escreve a tua password atual.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Erro', 'A nova palavra-passe deve ter pelo menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'A confirmação da nova palavra-passe não coincide.');
      return;
    }

    try {
      setSavingPassword(true);
      await account.updatePassword(newPassword, currentPassword);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      Alert.alert('Palavra-passe atualizada', 'A tua nova palavra-passe foi guardada.');
    } catch (error) {
      console.log('Erro ao atualizar palavra-passe:', error);
      Alert.alert('Erro', 'Não foi possível alterar a palavra-passe. Verifica a password atual.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (!hasAccount && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => goBackToConta(router)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.ink} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <TouchableOpacity onPress={() => goBackToConta(router)} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.ink} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Editar Perfil</Text>
            </View>

            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color="#fff" />
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: '#eef2ff' }]}>
                  <Ionicons name="person-outline" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.sectionLabel}>Dados da conta</Text>
                  <Text style={styles.sectionHint}>Altera o teu nome e email.</Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="O teu nome"
                placeholderTextColor={colors.faint}
                editable={!loading && !savingProfile}
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
                editable={!loading && !savingProfile}
              />

              {email.trim() !== initialEmail && (
                <>
                  <Text style={styles.inputLabel}>Password atual</Text>
                  <TextInput
                    style={styles.input}
                    value={emailPassword}
                    onChangeText={setEmailPassword}
                    placeholder="Necessária para alterar o email"
                    placeholderTextColor={colors.faint}
                    secureTextEntry
                    editable={!savingProfile}
                  />
                </>
              )}

              <TouchableOpacity
                style={[styles.saveButton, savingProfile && styles.saveButtonDisabled]}
                onPress={handleSaveProfile}
                disabled={loading || savingProfile}
              >
                <Text style={styles.saveButtonText}>
                  {savingProfile ? 'A guardar...' : 'Guardar dados'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: '#fff7ed' }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.warning} />
                </View>
                <View>
                  <Text style={styles.sectionLabel}>Palavra-passe</Text>
                  <Text style={styles.sectionHint}>Define uma nova palavra-passe.</Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>Password atual</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="A tua password atual"
                placeholderTextColor={colors.faint}
                secureTextEntry
                editable={!loading && !savingPassword}
              />

              <Text style={styles.inputLabel}>Nova palavra-passe</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor={colors.faint}
                secureTextEntry
                editable={!loading && !savingPassword}
              />

              <Text style={styles.inputLabel}>Confirmar nova palavra-passe</Text>
              <TextInput
                style={[styles.input, styles.inputLast]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repete a nova palavra-passe"
                placeholderTextColor={colors.faint}
                secureTextEntry
                editable={!loading && !savingPassword}
              />

              <TouchableOpacity
                style={[styles.saveButton, styles.saveButtonSecondary, savingPassword && styles.saveButtonDisabled]}
                onPress={handleSavePassword}
                disabled={loading || savingPassword}
              >
                <Text style={styles.saveButtonText}>
                  {savingPassword ? 'A guardar...' : 'Guardar palavra-passe'}
                </Text>
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
    backgroundColor: colors.faint,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    ...shadows.card,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 16,
    ...shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  sectionHint: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
    lineHeight: 18,
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
  inputLast: {
    marginBottom: 0,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  saveButtonSecondary: {
    backgroundColor: colors.ink,
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
