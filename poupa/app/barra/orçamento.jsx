import React, { useState } from 'react'; // Adicionado useState
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal, 
  TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const orçamentos = [
  { id: '1', title: 'Casa', gast: 420, total: 650, icon: 'home-outline', color: '#8e63ff' },
  { id: '2', title: 'Transportes', gast: 180, total: 300, icon: 'car-outline', color: '#3ad29f' },
  { id: '3', title: 'Lazer', gast: 95, total: 150, icon: 'heart-outline', color: '#ff6b6b' },
];

export default function OrcamentoScreen() {
  // Estado para controlar a visibilidade do Modal
  const [modalVisible, setModalVisible] = useState(false);

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orçamentos</Text>
        <Text style={styles.headerSubtitle}>Abril de 2026</Text>
      </View>

      <View style={styles.mainCard}>
        <View style={styles.mainCardTop}>
          <View>
            <Text style={styles.mainLabel}>Total Utilizado</Text>
            <Text style={styles.mainValue}>1.050€ <Text style={styles.slash}>/ 1.620€</Text></Text>
          </View>
          <View style={styles.percentageBadge}>
            <Text style={styles.percentageText}>65%</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: '65%' }]} />
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={16} color="#8e63ff" />
          <Text style={styles.infoText}>Restam 570€ para gastar este mês.</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Limites por Categoria</Text>
    </>
  );

  const renderItem = ({ item }) => {
    const percent = (item.gast / item.total) * 100;
    return (
      <View style={styles.catCard}>
        <View style={styles.catHeader}>
          <View style={styles.catLeft}>
            <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={styles.catTitle}>{item.title}</Text>
          </View>
          <Text style={styles.catValues}>{item.gast}€ / <Text style={{color: '#94a3b8'}}>{item.total}€</Text></Text>
        </View>
        <View style={styles.catProgressBg}>
          <View style={[styles.catProgressFill, { width: `${percent}%`, backgroundColor: item.color }]} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orçamentos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Orçamento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#cbd5e1" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoria</Text>
              <View style={styles.fakeInput}>
                <Text style={styles.placeholderText}>Selecione uma categoria</Text>
                <Ionicons name="chevron-down" size={20} color="#cbd5e1" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Limite mensal (€)</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="0.00" 
                keyboardType="numeric"
                placeholderTextColor="#cbd5e1"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Alertar quando atingir</Text>
                <Text style={styles.percentageValue}>80%</Text>
              </View>
              <View style={styles.sliderLine}>
                <View style={styles.sliderThumb} />
              </View>
              <Text style={styles.helperText}>Receberás um alerta quando gastares 80% do orçamento</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText}>Criar Orçamento</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f8' },
  listPadding: { paddingHorizontal: 20, paddingBottom: 100 }, // Aumentado para o FAB não tapar o último item
  header: { marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a1a' },
  headerSubtitle: { fontSize: 15, color: '#64748b' },
  mainCard: { backgroundColor: '#fff', padding: 20, borderRadius: 24, marginBottom: 25, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  mainCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  mainLabel: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  mainValue: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginTop: 4 },
  slash: { fontSize: 16, color: '#cbd5e1' },
  percentageBadge: { backgroundColor: '#8e63ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  percentageText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  progressContainer: { height: 10, backgroundColor: '#f1f5f9', borderRadius: 5, marginBottom: 15 },
  progressFill: { height: '100%', backgroundColor: '#8e63ff', borderRadius: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, color: '#64748b', marginLeft: 6 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 15 },
  catCard: { backgroundColor: '#fff', padding: 16, borderRadius: 20, marginBottom: 12 },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  catLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  catTitle: { fontWeight: 'bold', fontSize: 16, color: '#1e293b' },
  catValues: { fontSize: 14, fontWeight: '600', color: '#3ad29f' },
  catProgressBg: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 3 },
  catProgressFill: { height: '100%', borderRadius: 3 },

  // ESTILOS DO FAB (Botão flutuante)
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8e63ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#8e63ff',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  // ESTILOS DO MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: '60%',
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
    color: '#1a1a1a',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  fakeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  placeholderText: {
    color: '#94a3b8',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    fontSize: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentageValue: {
    color: '#8e63ff',
    fontWeight: 'bold',
  },
  sliderLine: {
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    marginVertical: 15,
    justifyContent: 'center',
  },
  sliderThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    position: 'absolute',
    left: '80%', // Simula os 80%
  },
  helperText: {
    fontSize: 12,
    color: '#94a3b8',
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  createButton: {
    flex: 2,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#8e63ff',
  },
  createButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});