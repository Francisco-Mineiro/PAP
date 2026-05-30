// PrivacyPolicy.js
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() =>   router.replace('barra/conta')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidade</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Quem Somos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quem Somos</Text>
          <Text style={styles.text}>
            O responsável pelo tratamento dos seus dados pessoais é o <Text style={styles.bold}>Poupa+</Text>, desenvolvida por <Text style={styles.bold}>Francisco Pinho Mineiro</Text>.
          </Text>
          <Text style={styles.text}>
            Estamos comprometidos em proteger a tua privacidade e garantir que os teus dados são tratados de forma transparente, segura e em conformidade com o Regulamento Geral de Proteção de Dados (RGPD).
          </Text>
          <Text style={styles.contact}>
            <Text style={styles.bold}>Contacto:</Text> franciscomineiro.163934@etpc.pt
          </Text>
        </View>

        {/* Dados Pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais que Recolhemos</Text>
          <Text style={styles.text}>
            À medida que utilizas a app, são recolhidos apenas os dados estritamente necessários para oferecer uma experiência completa e segura.
          </Text>
          <Text style={styles.subTitle}>Tipos de dados recolhidos:</Text>
          <Text style={styles.bullet}>• Dados de registo e perfil: Nome, apelido e endereço de email.</Text>
          <Text style={styles.bullet}>• Dados financeiros: Despesas, categorias, valores, datas e orçamentos.</Text>
          <Text style={styles.bullet}>• Dados opcionais: Fotografia de perfil e preferências de notificações.</Text>
        </View>

        {/* Finalidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Finalidade do Tratamento</Text>
          <Text style={styles.text}>Os teus dados são tratados para:</Text>
          <Text style={styles.bullet}>• Criar e gerir a tua conta de utilizador;</Text>
          <Text style={styles.bullet}>• Registar e organizar as tuas despesas e orçamentos;</Text>
          <Text style={styles.bullet}>• Fornecer análises pessoais e relatórios de gastos;</Text>
          <Text style={styles.bullet}>• Enviar notificações úteis relacionadas com os teus orçamentos;</Text>
          <Text style={styles.bullet}>• Melhorar a experiência e segurança da aplicação;</Text>
          <Text style={styles.bullet}>• Responder a pedidos de suporte e auxílio.</Text>
        </View>

        {/* Partilha */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partilha de Dados com Terceiros</Text>
          <Text style={styles.text}>
            Não vendemos os teus dados a terceiros.
          </Text>
          <Text style={styles.text}>
            Os teus dados são partilhados apenas com:
          </Text>
          <Text style={styles.bullet}>• Appwrite – para armazenamento seguro e autenticação.</Text>
        </View>

        {/* Direitos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Direitos dos Utilizadores</Text>
          <Text style={styles.text}>Enquanto utilizador, tens o direito de:</Text>
          <Text style={styles.bullet}>• Aceder aos teus dados pessoais;</Text>
          <Text style={styles.bullet}>• Corrigir informações incorretas;</Text>
          <Text style={styles.bullet}>• Eliminar os teus dados (apagar conta).</Text>
        </View>

        {/* Segurança */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança</Text>
          <Text style={styles.text}>Adotamos as seguintes medidas para proteger os teus dados:</Text>
          <Text style={styles.bullet}>• Armazenamento seguro no Appwrite;</Text>
          <Text style={styles.bullet}>• Autenticação protegida.</Text>
        </View>

        <Text style={styles.footer}>
          Última atualização: 27 de Maio de 2026
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 6,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginLeft: 8,
    marginBottom: 6,
  },
  contact: {
    fontSize: 15,
    color: '#444',
    marginTop: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    marginTop: 20,
    marginBottom: 30,
  },
});