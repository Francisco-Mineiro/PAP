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
import { colors, shadows, radius } from '../../src/theme';
import { useFinance } from '../../src/FinanceContext';
import { getNotificationPreference, showPhoneNotification } from '../../src/notifications';

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
        refreshFinanceData();
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
            } catch (error) {
              console.log("Erro ao terminar sessão:", error);
            } finally {
              setUser(null);
              router.replace('/index');
            }
          } 
        }
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      "Eliminar Dados",
      "Esta ação vai apagar os teus orçamentos e despesas. Queres continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await clearFinanceData();
              setPrivacyModalVisible(false);
              const wantsNotifications = await getNotificationPreference();
              const notificationShown = wantsNotifications
                ? await showPhoneNotification({
                    title: "Dados eliminados",
                    body: "Os teus orçamentos e despesas foram apagados.",
                  })
                : false;

              if (wantsNotifications && !notificationShown) {
                Alert.alert(
                  "Notificações desligadas",
                  "Os dados foram eliminados, mas tens de permitir notificações para receber avisos no telemóvel."
                );
              }
            } catch (error) {
              console.log("Erro ao eliminar dados financeiros:", error);
              Alert.alert("Erro", "Não foi possível eliminar os teus dados. Tenta novamente.");
            }
          },
        },
      ]
    );
  };

  const MenuOption = ({ icon, title, subtitle, onPress, color = colors.ink }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={[styles.menuTitle, { color }]}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
    
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.greeting}>Minha Conta</Text>
        <Text style={styles.date}>Gere o teu perfil e definições</Text>


        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
            <Text style={styles.userEmail}>{user?.email || "utilizador@email.com"}</Text>
          </View>
        </View>

      

        <Text style={styles.sectionTitle}>Definições</Text>

        <View style={styles.menuContainer}>
          <MenuOption 
            icon="person-outline" 
            title="Editar Perfil" 
            subtitle="Nome, email "
            onPress={() => router.push('barra/editarPerfil')} 
          />
          <MenuOption 
            icon="notifications-outline" 
            title="Notificações" 
            subtitle="Alertas de gastos e orçamentos"
            onPress={() => router.push('barra/notificacoes')} 
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
            color={colors.danger}
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
                style={[styles.contactButton, { backgroundColor: colors.danger }]} 
                onPress={handleDeleteAllData}
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
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.ink,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 25,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: radius.lg,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.faint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.ink,
  },
  userEmail: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.ink,
    marginBottom: 15,
    marginLeft: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  statValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  balanceCard: {
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 28,
    ...shadows.card,
  },
  balanceLabel: {
    color: colors.faint,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
  },
  negativeBalance: {
    color: colors.danger,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: 5,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
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
    color: colors.muted,
    marginTop: 2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '75%',
    paddingTop: 20,
  }
  ,
  modalContent2: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
    color: colors.ink,
    marginTop: 20,
    marginBottom: 12,
  },
  faqItem: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  faqQuestion: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 8,
  },
  faqAnswer: {
    color: colors.muted,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: radius.md,
    marginTop: 15,
    gap: 10,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
