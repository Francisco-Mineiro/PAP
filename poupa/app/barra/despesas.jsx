import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, radius } from '../../src/theme';
import { useFinance } from '../../src/FinanceContext';
import { showPhoneNotification } from '../../src/notifications';

export default function DespesasScreen() {
  const modalScrollRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { expenses, budgets, totals, addExpense, formatMoney } = useFinance();

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    setTitle('');
    setCategory('');
    setValue('');
  };

  const handleAddExpense = async () => {
    const created = addExpense({ title, category, value });

    if (!created) {
      Alert.alert('Erro', 'Preenche o título e um valor maior que zero.');
      return;
    }

    if (created.error === 'missingBudget') {
      Alert.alert(
        'Orçamento obrigatório',
        `Antes de adicionares uma despesa em ${created.category}, cria primeiro um orçamento com essa categoria.`
      );
      return;
    }

    closeModal();

    if (created.alert) {
      const notificationShown = await showPhoneNotification({
        title: 'Alerta de orçamento',
        body: `A categoria ${created.alert.category} atingiu ${created.alert.alertPercent}% do orçamento (${formatMoney(created.alert.spent)} / ${formatMoney(created.alert.total)}).`,
      });

      if (!notificationShown) {
        Alert.alert(
          'Notificações desligadas',
          'Ativaste um alerta de orçamento, mas tens de permitir notificações para receber avisos no telemóvel.'
        );
      }
    }
  };

  const scrollModalToField = (yPosition) => {
    setTimeout(() => {
      modalScrollRef.current?.scrollTo({ y: yPosition, animated: true });
    }, 250);
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Despesas</Text>
        <Text style={styles.headerSubtitle}>Gerir transações</Text>
      </View>

      <View style={styles.blackCard}>
        <Text style={styles.cardLabel}>Gastos do Mês</Text>
        <Text style={styles.cardValue}>-{formatMoney(totals.monthlySpent)}</Text>
       
      </View>

      <Text style={styles.sectionTitle}>Histórico Despesas</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={expenses}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<Text style={styles.emptyText}>Ainda não adicionaste despesas.</Text>}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconCircle, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSub}>{item.cat} • {item.date}</Text>
              </View>
            </View>
            <Text style={styles.itemValue}>-{formatMoney(item.amount)}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Nova Despesa</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close-circle" size={28} color="#cbd5e1" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  ref={modalScrollRef}
                  scrollEnabled={keyboardVisible}
                  bounces={false}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.modalBody,
                    keyboardVisible && styles.modalBodyKeyboardOpen,
                  ]}
                >
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Título da Despesa</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Ex: Almoço, Cinema..."
                      placeholderTextColor="#cbd5e1"
                      value={title}
                      onChangeText={setTitle}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Categoria</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder={budgets.length > 0 ? 'Escreve uma categoria existente' : 'Cria primeiro um orçamento'}
                      placeholderTextColor="#cbd5e1"
                      value={category}
                      onChangeText={setCategory}
                      editable={budgets.length > 0}
                    />
                    {budgets.length > 0 ? (
                      <View style={styles.categoryChips}>
                        {budgets.map((budget) => (
                          <TouchableOpacity
                            key={budget.id}
                            style={[
                              styles.categoryChip,
                              category.trim().toLowerCase() === budget.title.toLowerCase() && styles.categoryChipActive,
                            ]}
                            onPress={() => setCategory(budget.title)}
                          >
                            <Text
                              style={[
                                styles.categoryChipText,
                                category.trim().toLowerCase() === budget.title.toLowerCase() && styles.categoryChipTextActive,
                              ]}
                            >
                              {budget.title}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.helperText}>Vai a Orçamentos e cria uma categoria antes de adicionar despesas.</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Valor (€)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="0.00"
                      keyboardType="numeric"
                      placeholderTextColor="#cbd5e1"
                      value={value}
                      onChangeText={setValue}
                      onFocus={() => scrollModalToField(150)}
                    />
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={closeModal}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createButton} onPress={handleAddExpense}>
                      <Text style={styles.createButtonText}>Adicionar Gasto</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listPadding: { paddingHorizontal: 20, paddingBottom: 100 },
  header: { marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: colors.ink },
  headerSubtitle: { fontSize: 15, color: colors.muted },
  blackCard: { backgroundColor: colors.ink, padding: 24, borderRadius: radius.lg, marginBottom: 25, ...shadows.card },
  cardLabel: { color: colors.faint, fontSize: 14, fontWeight: '600' },
  cardValue: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderTopWidth: 0.5, borderTopColor: '#334155', paddingTop: 15 },
  footerLabel: { color: colors.faint, fontSize: 12 },
  footerValue: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.ink, marginBottom: 15 },
  itemCard: { backgroundColor: colors.surface, padding: 16, borderRadius: radius.md, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: colors.ink },
  itemSub: { fontSize: 12, color: colors.faint, marginTop: 2 },
  itemValue: { fontSize: 16, fontWeight: '800', color: colors.danger },
  emptyText: { color: colors.muted, textAlign: 'center', marginTop: 12 },

  // BOTÃO FLUTUANTE
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  // ESTILOS DO MODAL
  modalAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    minHeight: '55%',
    maxHeight: '90%',
  },
  modalBody: {
    paddingBottom: 20,
  },
  modalBodyKeyboardOpen: {
    paddingBottom: 70,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.ink,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: 8,
  },
  fakeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 12,
    backgroundColor: colors.background,
  },
  placeholderText: {
    color: colors.faint,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 12,
    backgroundColor: colors.background,
    fontSize: 16,
    color: colors.ink,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#eef2ff',
  },
  categoryChipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  categoryChipTextActive: {
    color: colors.primary,
  },
  helperText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    marginRight: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontWeight: 'bold',
    color: colors.ink,
  },
  createButton: {
    flex: 2,
    padding: 16,
    alignItems: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  createButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});
