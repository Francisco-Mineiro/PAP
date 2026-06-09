import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  Alert,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, radius } from '../../src/theme';
import { useFinance } from '../../src/FinanceContext';

function AlertSlider({ value, onChange }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const sliderRef = useRef(null);
  const trackXRef = useRef(0);

  const updateValue = (pageX) => {
    if (trackWidth <= 0) return;

    const xPosition = pageX - trackXRef.current;
    const percent = Math.round(Math.min(Math.max(xPosition / trackWidth, 0), 1) * 100);
    onChange(percent);
  };

  const measureTrackPosition = () => {
    sliderRef.current?.measureInWindow((x) => {
      trackXRef.current = x;
    });
  };

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (event) => {
          Keyboard.dismiss();
          measureTrackPosition();
          updateValue(event.nativeEvent.pageX);
        },
        onPanResponderMove: (event) => {
          updateValue(event.nativeEvent.pageX);
        },
      }),
    [trackWidth]
  );

  return (
    <View
      ref={sliderRef}
      style={styles.sliderTouchArea}
      onLayout={(event) => {
        setTrackWidth(event.nativeEvent.layout.width);
        measureTrackPosition();
      }}
      {...panResponder.panHandlers}
    >
      <View style={styles.sliderLine}>
        <View style={[styles.sliderFill, { width: `${value}%` }]} />
        <View style={[styles.sliderThumb, { left: `${value}%` }]} />
      </View>
    </View>
  );
}

export default function OrcamentoScreen() {
  const modalScrollRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [alertPercent, setAlertPercent] = useState(80);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { budgets, totals, addBudget, formatMoney } = useFinance();

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
    setCategory('');
    setLimit('');
    setAlertPercent(80);
  };

  const handleAddBudget = () => {
    const created = addBudget({ title: category, total: limit, alertPercent });

    if (!created) {
      Alert.alert('Erro', 'Preenche a categoria e um limite maior que zero.');
      return;
    }

    closeModal();
  };

  const scrollModalToField = (yPosition) => {
    setTimeout(() => {
      modalScrollRef.current?.scrollTo({ y: yPosition, animated: true });
    }, 250);
  };

  const remainingText =
    totals.totalBudget > 0
      ? `Restam ${formatMoney(Math.max(totals.remainingBudget, 0))} para gastar este mês.`
      : 'Cria um orçamento para acompanhares os teus limites.';

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orçamentos</Text>
        <Text style={styles.headerSubtitle}>Este mês</Text>
      </View>

      <View style={styles.mainCard}>
        <View style={styles.mainCardTop}>
          <View>
            <Text style={styles.mainLabel}>Total Utilizado</Text>
            <Text style={styles.mainValue}>
              {formatMoney(totals.monthlySpent)} <Text style={styles.slash}>/ {formatMoney(totals.totalBudget)}</Text>
            </Text>
          </View>
          <View style={styles.percentageBadge}>
            <Text style={styles.percentageText}>{Math.round(totals.usedPercent)}%</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: `${totals.usedPercent}%` }]} />
        </View>

      
      </View>

      <Text style={styles.sectionTitle}>Limites por Categoria</Text>
    </>
  );

  const renderItem = ({ item }) => {
    const percent = item.total > 0 ? Math.min((item.gast / item.total) * 100, 100) : 0;
    return (
      <View style={styles.catCard}>
        <View style={styles.catHeader}>
          <View style={styles.catLeft}>
            <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={styles.catTitle}>{item.title}</Text>
          </View>
          <Text style={styles.catValues}>
            {formatMoney(item.gast)} / <Text style={{color: colors.faint}}>{formatMoney(item.total)}</Text>
          </Text>
        </View>
        <View style={styles.catProgressBg}>
          <View style={[styles.catProgressFill, { width: `${percent}%`, backgroundColor: item.color }]} />
        </View>
        <Text style={styles.alertText}>Alerta aos {item.alertPercent || 80}%</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={budgets}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<Text style={styles.emptyText}>Ainda não criaste orçamentos.</Text>}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />

      {/* BOTÃO FLUTUANTE (FAB) - Como na primeira imagem */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* MODAL DO NOVO ORÇAMENTO - Como na segunda imagem */}
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
                  <Text style={styles.modalTitle}>Novo Orçamento</Text>
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
                    <Text style={styles.inputLabel}>Categoria</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Ex: Casa, Transportes, Lazer..."
                      placeholderTextColor="#cbd5e1"
                      value={category}
                      onChangeText={setCategory}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Limite mensal (€)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="0.00"
                      keyboardType="numeric"
                      placeholderTextColor="#cbd5e1"
                      value={limit}
                      onChangeText={setLimit}
                      onFocus={() => scrollModalToField(80)}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={styles.inputLabel}>Alertar quando atingir</Text>
                      <Text style={styles.percentageValue}>{alertPercent}%</Text>
                    </View>
                    <AlertSlider value={alertPercent} onChange={setAlertPercent} />
                    <Text style={styles.helperText}>Receberás um alerta quando gastares {alertPercent}% do orçamento</Text>
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={closeModal}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createButton} onPress={handleAddBudget}>
                      <Text style={styles.createButtonText}>Criar Orçamento</Text>
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
  listPadding: { paddingHorizontal: 20, paddingBottom: 100 }, // Aumentado para o FAB não tapar o último item
  header: { marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: colors.ink },
  headerSubtitle: { fontSize: 15, color: colors.muted },
  mainCard: { backgroundColor: colors.surface, padding: 20, borderRadius: radius.lg, marginBottom: 25, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  mainCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  mainLabel: { fontSize: 14, color: colors.muted, fontWeight: '600' },
  mainValue: { fontSize: 24, fontWeight: 'bold', color: colors.ink, marginTop: 4 },
  slash: { fontSize: 16, color: colors.faint },
  percentageBadge: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.sm },
  percentageText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  progressContainer: { height: 10, backgroundColor: '#edf2f7', borderRadius: 5, marginBottom: 15 },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, color: colors.muted, marginLeft: 6 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.ink, marginBottom: 15 },
  catCard: { backgroundColor: colors.surface, padding: 16, borderRadius: radius.md, marginBottom: 12, borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  catLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  catTitle: { fontWeight: 'bold', fontSize: 16, color: colors.ink },
  catValues: { fontSize: 14, fontWeight: '600', color: colors.accent },
  catProgressBg: { height: 6, backgroundColor: '#edf2f7', borderRadius: 3 },
  catProgressFill: { height: '100%', borderRadius: 3 },
  alertText: { color: colors.faint, fontSize: 12, fontWeight: '600', marginTop: 8 },
  emptyText: { color: colors.muted, textAlign: 'center', marginTop: 12 },

  // ESTILOS DO FAB (Botão flutuante)
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
    minHeight: '60%',
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
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentageValue: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  sliderTouchArea: {
    paddingVertical: 14,
  },
  sliderLine: {
    height: 4,
    backgroundColor: '#edf2f7',
    borderRadius: 2,
    justifyContent: 'center',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  sliderThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: colors.primary,
    position: 'absolute',
    marginLeft: -11,
    ...shadows.soft,
  },
  helperText: {
    fontSize: 12,
    color: colors.faint,
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
