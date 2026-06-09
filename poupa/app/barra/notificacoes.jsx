import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadows } from '../../src/theme';
import {
  getNotificationPreference,
  requestNotificationPermissions,
  setNotificationPreference,
} from '../../src/notifications';

export default function Notificacoes() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadPreference = async () => {
      const enabled = await getNotificationPreference();
      setNotificationsEnabled(enabled);
    };

    loadPreference();
  }, []);

  const handleToggle = async (enabled) => {
    if (!enabled) {
      await setNotificationPreference(false);
      setNotificationsEnabled(false);
      return;
    }

    const hasPermission = await requestNotificationPermissions();

    if (!hasPermission) {
      Alert.alert(
        'Notificações bloqueadas',
        'Tens de permitir notificações no telemóvel para as receber.'
      );
      setNotificationsEnabled(false);
      await setNotificationPreference(false);
      return;
    }

    await setNotificationPreference(true);
    setNotificationsEnabled(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() =>
          
          
          
         router.replace('barra/conta')} 


          
          activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </TouchableOpacity>
          <Text style={styles.title}>Notificações</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={notificationsEnabled ? 'notifications-outline' : 'notifications-off-outline'}
              size={28}
              color="#fff"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>
              {notificationsEnabled ? 'Receber notificações' : 'Não receber notificações'}
            </Text>
            <Text style={styles.cardText}>
              {notificationsEnabled
                ? 'A Poupa pode mostrar avisos importantes.'
                : 'A Poupa não vai mostrar notificações.'}
            </Text>
          </View>

          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: colors.border, true: '#bfdbfe' }}
            thumbColor={notificationsEnabled ? colors.primary : colors.faint}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 14,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.card,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
