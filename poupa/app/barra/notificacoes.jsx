import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, shadows } from '../../src/theme';
import { useFinance } from '../../src/FinanceContext';
import {
  getNotificationPreference,
  getNotificationStatus,
  openNotificationSettings,
  requestNotificationPermissions,
  setNotificationPreference,
  showPhoneNotification,
} from '../../src/notifications';

const alertTypes = [
  {
    icon: 'wallet-outline',
    color: colors.primary,
    title: 'Alertas de orçamento',
    description: 'Aviso quando uma categoria atinge a percentagem definida no orçamento.',
  },
  {
    icon: 'shield-checkmark-outline',
    color: colors.accent,
    title: 'Ações da conta',
    description: 'Confirmações importantes, como eliminação de dados financeiros.',
  },
];




function AlertTypeRow({ icon, color, title, description }) {
  return (
    <View style={styles.alertTypeRow}>
      <View style={[styles.alertTypeIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.alertTypeText}>
        <Text style={styles.alertTypeTitle}>{title}</Text>
        <Text style={styles.alertTypeDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function Notificacoes() {
  const router = useRouter();
  const { budgets, formatMoney } = useFinance();
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const loadState = useCallback(async () => {
    setLoading(true);
    try {
      const [enabled, status] = await Promise.all([
        getNotificationPreference(),
        getNotificationStatus(),
      ]);
      setNotificationsEnabled(enabled);
      setPermissionGranted(status.granted);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadState();
    }, [loadState])
  );

  const handleBack = () => {
    router.replace('/barra/conta');
  };

  const handleToggle = async (enabled) => {
    if (!enabled) {
      await setNotificationPreference(false);
      setNotificationsEnabled(false);
      return;
    }

    const hasPermission = await requestNotificationPermissions();
    setPermissionGranted(hasPermission);

    if (!hasPermission) {
      Alert.alert(
        'Notificações bloqueadas',
        'Tens de permitir notificações nas definições do telemóvel para as receber.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir definições', onPress: openNotificationSettings },
        ]
      );
      setNotificationsEnabled(false);
      await setNotificationPreference(false);
      return;
    }

    await setNotificationPreference(true);
    setNotificationsEnabled(true);
  };

  const handleTestNotification = async () => {
    if (!notificationsEnabled) {
      Alert.alert('Notificações desligadas', 'Ativa as notificações primeiro para fazer o teste.');
      return;
    }

    setTesting(true);
    try {
      const shown = await showPhoneNotification({
        title: 'Teste da Poupa',
        body: 'As tuas notificações estão a funcionar corretamente.',
      });

      if (!shown) {
        const status = await getNotificationStatus();
        setPermissionGranted(status.granted);
        Alert.alert(
          'Não foi possível enviar',
          'Verifica se as notificações estão permitidas no telemóvel.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir definições', onPress: openNotificationSettings },
          ]
        );
        return;
      }

      Alert.alert('Notificação enviada', 'Deves receber um aviso no telemóvel em breve.');
    } finally {
      setTesting(false);
    }
  };

  const budgetsWithAlerts = budgets.filter((budget) => (budget.alertPercent || 80) > 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={colors.ink} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Notificações</Text>
            <Text style={styles.subtitle}>Gere alertas e avisos da app</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <>
          

            <View style={styles.card}>
              <View style={styles.toggleRow}>
                <View style={[styles.mainIcon, notificationsEnabled && styles.mainIconActive]}>
                  <Ionicons
                    name={notificationsEnabled ? 'notifications' : 'notifications-off-outline'}
                    size={24}
                    color={notificationsEnabled ? '#fff' : colors.muted}
                  />
                </View>
                <View style={styles.toggleText}>
                  <Text style={styles.cardTitle}>Receber notificações</Text>
                  <Text style={styles.cardText}>
                    {notificationsEnabled
                      ? 'A Poupa pode enviar alertas de orçamento e avisos importantes.'
                      : 'Não vais receber avisos no telemóvel.'}
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleToggle}
                  trackColor={{ false: colors.border, true: '#bfdbfe00' }}
                  thumbColor={notificationsEnabled ? colors.primary : colors.faint}
                />
              </View>
            </View>

            {!permissionGranted && notificationsEnabled && (
              <TouchableOpacity style={styles.settingsButton} onPress={openNotificationSettings}>
                <Ionicons name="settings-outline" size={20} color={colors.primary} />
                <Text style={styles.settingsButtonText}>Abrir definições do telemóvel</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.faint} />
              </TouchableOpacity>
            )}

           

            <Text style={styles.sectionTitle}>Orçamentos com alerta</Text>
            <View style={styles.sectionCard}>
              {budgetsWithAlerts.length === 0 ? (
                <View style={styles.emptyBudgets}>
                  <Ionicons name="pie-chart-outline" size={28} color={colors.faint} />
                  <Text style={styles.emptyBudgetsTitle}>Sem orçamentos configurados</Text>
                  <Text style={styles.emptyBudgetsText}>
                    Cria um orçamento e define a percentagem de alerta para receber avisos ao gastar.
                  </Text>  
                </View>
              ) : (
                budgetsWithAlerts.map((budget) => {
                  const percent = budget.total > 0 ? Math.min((budget.gast / budget.total) * 100, 100) : 0;
                  const alertPercent = budget.alertPercent || 80;
                  const nearAlert = percent >= alertPercent * 0.75;

                  return (
                    <View key={budget.id} style={styles.budgetRow}>
                      <View style={[styles.budgetIcon, { backgroundColor: `${budget.color}15` }]}>
                        <Ionicons name={budget.icon} size={18} color={budget.color} />
                      </View>
                      <View style={styles.budgetText}>
                        <Text style={styles.budgetTitle}>{budget.title}</Text>
                        <Text style={styles.budgetMeta}>
                          Alerta aos {alertPercent}% · {formatMoney(budget.gast)} / {formatMoney(budget.total)}
                        </Text>
                      </View>
                      <View style={[styles.budgetBadge, nearAlert && styles.budgetBadgeWarning]}>
                        <Text style={[styles.budgetBadgeText, nearAlert && styles.budgetBadgeTextWarning]}>
                          {Math.round(percent)}%
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            <Text style={styles.sectionTitle}>Testar</Text>
            <TouchableOpacity
              style={[styles.testButton, testing && styles.testButtonDisabled]}
              onPress={handleTestNotification}
              disabled={testing}
              activeOpacity={0.8}
            >
              {testing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="paper-plane-outline" size={20} color="#fff" />
                  <Text style={styles.testButtonText}>Enviar notificação de teste</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              {Platform.OS === 'android'
                ? 'No Android, podes gerir sons e prioridade nas definições do sistema.'
                : 'No iPhone, podes ajustar sons e estilo nas definições do sistema.'}
            </Text>
          </>
        )}
      </ScrollView>
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
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
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
    ...shadows.soft,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  statusBannerActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  statusBannerWarning: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  statusBannerMuted: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusTextWrap: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 14,
    ...shadows.card,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  mainIconActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
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
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 24,
    gap: 10,
    ...shadows.soft,
  },
  settingsButtonText: {
    flex: 1,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 12,
    marginLeft: 2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 24,
    ...shadows.soft,
  },
  alertTypeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  alertTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertTypeText: {
    flex: 1,
  },
  alertTypeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 3,
  },
  alertTypeDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  emptyBudgets: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  emptyBudgetsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 10,
    marginBottom: 6,
  },
  emptyBudgetsText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 14,
  },
  emptyBudgetsButton: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  emptyBudgetsButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  budgetText: {
    flex: 1,
  },
  budgetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  budgetMeta: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  budgetBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  budgetBadgeWarning: {
    backgroundColor: '#fec7c7',
  },
  budgetBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  budgetBadgeTextWarning: {
    color: colors.danger,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    marginBottom: 12,
    ...shadows.card,
  },
  testButtonDisabled: {
    opacity: 0.7,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  footerNote: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.faint,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
