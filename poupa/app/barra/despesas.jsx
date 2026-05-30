// app/barra/Despesas.js
import React, { useState } from 'react';
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

const despesas = [
  { id: '1', title: 'Netflix', cat: 'Entretenimento', date: '04/01/2026', value: '-9.99€', color: '#8e63ff', icon: 'play' },
  { id: '2', title: 'Gasolina', cat: 'Transportes', date: '03/01/2026', value: '-42.50€', color: '#3ad29f', icon: 'car' },
  { id: '3', title: 'Continente', cat: 'Supermercado', date: '02/01/2026', value: '-78.32€', color: '#ff6b6b', icon: 'cart' },
];

export default function DespesasScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Despesas</Text>
        <Text style={styles.headerSubtitle}>Gerir transações</Text>
      </View>

      <View style={styles.blackCard}>
        <Text style={styles.cardLabel}>Total do Mês</Text>
        <Text style={styles.cardValue}>-186,06€</Text>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.footerLabel}>Transações</Text>
            <Text style={styles.footerValue}>15</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.footerLabel}>Maior gasto</Text>
            <Text style={styles.footerValue}>-78,32€</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Histórico Recente</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={despesas}
        ListHeaderComponent={renderHeader}
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
            <Text style={styles.itemValue}>{item.value}</Text>
          </View>
        )}
      />

      {/* BOTÃO FLUTUANTE (FAB) */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* MODAL DE NOVA DESPESA */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Despesa</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#cbd5e1" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título da Despesa</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="Ex: Almoço, Cinema..." 
                placeholderTextColor="#cbd5e1"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoria</Text>
              <View style={styles.fakeInput}>
                <Text style={styles.placeholderText}>Selecionar categoria</Text>
                <Ionicons name="chevron-down" size={20} color="#cbd5e1" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Valor (€)</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="0.00" 
                keyboardType="numeric"
                placeholderTextColor="#cbd5e1"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText}>Adicionar Gasto</Text>
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
  listPadding: { paddingHorizontal: 20, paddingBottom: 100 },
  header: { marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a1a' },
  headerSubtitle: { fontSize: 15, color: '#64748b' },
  blackCard: { backgroundColor: '#1a1a1a', padding: 24, borderRadius: 28, marginBottom: 25 },
  cardLabel: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  cardValue: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderTopWidth: 0.5, borderTopColor: '#334155', paddingTop: 15 },
  footerLabel: { color: '#94a3b8', fontSize: 12 },
  footerValue: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 15 },
  itemCard: { backgroundColor: '#fff', padding: 16, borderRadius: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  itemSub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  itemValue: { fontSize: 16, fontWeight: '800', color: '#ff6b6b' },

  // BOTÃO FLUTUANTE
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
    minHeight: '55%',
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
    color: '#1a1a1a',
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