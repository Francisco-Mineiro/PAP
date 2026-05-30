// Conta.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { account } from '../../src/appwrite';

export default function Conta() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        console.log("Erro ao carregar perfil:", error);
      }
    };
    getUserData();
  }, []);

  const gotoIA = () => {
    router.push('barra/IA'); 
    setHelpModalVisible(false);
  };

const gotoprivacidade = () => {
    router.push('barra/privacidade'); 
    setPrivacyModalVisible(false);
  };



  const handleLogout = async () => {
    Alert.alert(
      "Terminar Sessão",
      "Tens a certeza que queres sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive", 
          onPress: async () => {
            try {
              await account.deleteSession('current');
              router.replace('/');
            } catch (error) {
              router.replace('/');
            }
          } 
        }
      ]
    );
  };

  const MenuOption = ({ icon, title, subtitle, onPress, color = "#000" }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={[styles.menuTitle, { color }]}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.greeting}>Minha Conta</Text>
        <Text style={styles.date}>Gere o teu perfil e definições</Text>

        {/* Card de Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || "Carregando..."}</Text>
            <Text style={styles.userEmail}>{user?.email || "utilizador@email.com"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Definições</Text>

        <View style={styles.menuContainer}>
          <MenuOption 
            icon="person-outline" 
            title="Editar Perfil" 
            subtitle="Nome, email e foto"
            onPress={() => {}} 
          />
          <MenuOption 
            icon="notifications-outline" 
            title="Notificações" 
            subtitle="Alertas de gastos e orçamentos"
            onPress={() => {}} 
          />
          <MenuOption 
            icon="shield-checkmark-outline" 
            title="Privacidade e Segurança" 
            subtitle="Dados e proteção"
            onPress={() => setPrivacyModalVisible(true)} 
          />
          <MenuOption 
            icon="help-circle-outline" 
            title="Ajuda e Suporte" 
            subtitle="Perguntas frequentes e contacto"
            onPress={() => setHelpModalVisible(true)} 
          />
        </View>

        <Text style={styles.sectionTitle}>Ações</Text>
        
        <View style={styles.menuContainer}>
          <MenuOption 
            icon="log-out-outline" 
            title="Sair da Sessão" 
            color="#ff4d4d"
            onPress={handleLogout} 
          />
        </View>

      </ScrollView>

      <Modal
        visible={helpModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajuda e Suporte</Text>
              <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.helpSectionTitle}>Perguntas Frequentes</Text>
              
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Como posso adicionar uma despesa?</Text>
                <Text style={styles.faqAnswer}>Vai à aba "Despesas" e clica no botão + no canto inferior.</Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Como definir um orçamento?</Text>
                <Text style={styles.faqAnswer}>Na aba "Orçamento", clica em "Novo Orçamento" e define o limite por categoria.</Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Os meus dados estão seguros?</Text>
                <Text style={styles.faqAnswer}>Sim. Usamos encriptação e autenticação segura via Appwrite.</Text>
              </View>

              <Text style={styles.helpSectionTitle}>Outras formas de obter ajuda</Text>
              <TouchableOpacity onPress={gotoIA} style={styles.contactButton}>
                <Ionicons name="chatbubble-ellipses-outline" size={22} color="#fff" />
                <Text style={styles.contactButtonText}>Falar com assistente virtual</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={privacyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent2}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacidade e Segurança</Text>
              <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.helpSectionTitle}>As tuas informações estão protegidas</Text>
        

              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Que dados recolhemos?</Text>
                <Text style={styles.faqAnswer}>Apenas o necessário: nome, email, despesas e orçamentos. Nunca vendemos os teus dados a terceiros.</Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Posso apagar todos os meus dados?</Text>
                <Text style={styles.faqAnswer}>Sim. Podes solicitar a eliminação completa da tua conta e dados a qualquer momento.</Text>
              </View>

              <TouchableOpacity 
                style={[styles.contactButton, { backgroundColor: '#ff6b6b' }]} 
                onPress={() => Alert.alert(
                  "Eliminar Dados", 
                  "Esta ação é irreversível. Queres continuar?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Eliminar", style: "destructive" }
                  ]
                )}
              >
                <Ionicons name="trash-outline" size={22} color="#fff" />
                <Text style={styles.contactButtonText}>Eliminar todos os meus dados</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactButton} onPress={gotoprivacidade} >
                <Ionicons name="document-text-outline" size={22} color="#fff" />
                <Text style={styles.contactButtonText}>Ver Termos de Privacidade</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#777',
    marginBottom: 25,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8e63ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    marginLeft: 5,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 5,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuIconContainer: {
    width: 35,
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#f2f4f8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '75%',
    paddingTop: 20,
  }
  ,
  modalContent2: {
    backgroundColor: '#f2f4f8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '65%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  helpSectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  faqItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  faqQuestion: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 8,
  },
  faqAnswer: {
    color: '#666',
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#8e63ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    marginTop: 15,
    gap: 10,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});