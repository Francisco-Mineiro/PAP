import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { account } from '../../src/appwrite';
import { colors, shadows, radius } from '../../src/theme';
import { useFinance } from '../../src/FinanceContext';

const now = new Date();
const data = now.toLocaleDateString('pt-PT', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { expenses, totals, formatMoney, refreshFinanceData } = useFinance();

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        refreshFinanceData();
      } catch (error) {
        console.log("Erro ao buscar utilizador:", error);
      }
    };
    getUser();
  }, []);

  const renderHeader = () => (
    <>
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0] || "Usuário"}</Text>
          <Text style={styles.date}>{data}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.profileBtn}
          onPress={() => router.push('/barra/notificacoes')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.ink} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.mainBalanceCard}>
           <Text style={styles.mainBalanceLabel}>Gasto este mês</Text>
           <Text style={styles.mainBalanceValue}>{formatMoney(totals.monthlySpent)}</Text>
           <View style={styles.trendContainer}>
              <Ionicons name="trending-down" size={16} color="#3ad29f" />
              <Text style={styles.trendText}>
                {totals.totalBudget > 0
                  ? `${Math.round(totals.usedPercent)}% do orçamento usado`
                  : 'Define um orçamento para acompanhar limites'}
              </Text>
           </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.smallCard, { backgroundColor: '#eef2ff' }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
              <Ionicons name="flash" size={18} color="#fff" />
            </View>
            <Text style={styles.smallCardValue}>{formatMoney(totals.dailyAverage)}</Text>
            <Text style={styles.smallCardLabel}>Média Diária</Text>
          </View>

          <View style={[styles.smallCard, { backgroundColor: '#fff5f5' }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.danger }]}>
              <Ionicons name="receipt" size={18} color="#fff" />
            </View>
            <Text style={styles.smallCardValue}>{totals.expenseCount}</Text>
            <Text style={styles.smallCardLabel}>Despesas</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Atividade Recente</Text>
        <TouchableOpacity onPress={() => router.replace('/barra/despesas')}>
          <Text style={styles.seeAll}>Ver tudo</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseLeft}>
        <View style={[styles.expenseLine, { backgroundColor: item.color }]} />
        <View>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expenseDate}>{item.date}</Text>
        </View>
      </View>
      <Text style={styles.expenseValue}>-{formatMoney(item.amount)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={expenses.slice(0, 5)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<Text style={styles.emptyText}>Ainda não há despesas recentes.</Text>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

// ... (teus estilos mantêm-se iguais)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.ink,
  },
  date: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  profileBtn: {
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadows.soft,
  },
  summaryGrid: {
    marginBottom: 30,
  },
  mainBalanceCard: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: radius.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  mainBalanceLabel: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '600',
  },
  mainBalanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.ink,
    marginVertical: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    color: colors.accent,
    marginLeft: 4,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallCard: {
    width: '48%',
    padding: 16,
    borderRadius: radius.lg,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  smallCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.ink,
  },
  smallCardLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.ink,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: '600',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseLine: {
    width: 4,
    height: 30,
    borderRadius: 2,
    marginRight: 12,
  },
  expenseTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.ink,
  },
  expenseDate: {
    color: colors.faint,
    fontSize: 12,
  },
  expenseValue: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 15,
  },
  emptyText: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
  },
});
