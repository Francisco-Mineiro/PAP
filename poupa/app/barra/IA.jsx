import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      text: 'Olá! Como posso ajudar com os teus orçamentos ou poupanças hoje?',
      sender: 'ai'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { id: Date.now().toString(), text: input.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch("https://pap-lcm3.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput })
      });
      const data = await response.json();
      const aiMessage = { id: (Date.now() + 1).toString(), text: data.reply || "Sem resposta.", sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 2).toString(), 
        text: "Erro de ligação. Tenta novamente.", 
        sender: 'ai' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assistente IA</Text>
        <Text style={styles.headerSubtitle}>Especialista em Finanças</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.messageWrapper, item.sender === 'user' ? styles.userWrapper : styles.aiWrapper]}>
            <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.aiText]}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {isLoading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="small" color="#8e63ff" />
          <Text style={styles.loadingText}>A pensar...</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Escreve a tua dúvida..."
              placeholderTextColor="#94a3b8"
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, !input.trim() && styles.sendDisabled]}
              onPress={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Ionicons name="arrow-up" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f8' },
  header: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a1a' },
  headerSubtitle: { fontSize: 15, color: '#64748b' },
  keyboardContainer: { flex: 0 },
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 30,
    flexGrow: 1 
  },

  messageWrapper: { marginVertical: 6, flexDirection: 'row' },
  userWrapper: { justifyContent: 'flex-end' },
  aiWrapper: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '85%', paddingVertical: 13, paddingHorizontal: 18, borderRadius: 22 },
  userBubble: { backgroundColor: '#8e63ff', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  messageText: { fontSize: 16, lineHeight: 23 },
  userText: { color: '#fff' },
  aiText: { color: '#1e293b' },

  loadingWrapper: { flexDirection: 'row', justifyContent: 'center', padding: 12 },
  loadingText: { marginLeft: 8, color: '#64748b' },

  inputArea: { 
    paddingHorizontal: 16, 
    paddingBottom: 12, 
    paddingTop: 8,
    backgroundColor: '#f2f4f8',
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 30, 
    paddingHorizontal: 10, 
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: { 
    flex: 1, 
    paddingHorizontal: 16, 
    fontSize: 16, 
    maxHeight: 110,
    paddingVertical: 12,
  },
  sendButton: { 
    backgroundColor: '#1a1a1a', 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendDisabled: { backgroundColor: '#cbd5e1' },
}); 