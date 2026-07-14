import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { account } from '../../src/appwrite';
import { colors, shadows, radius } from '../../src/theme';

const welcomeMessages = [
  {
    id: 'welcome',
    text: 'Olá! Como posso ajudar?',
    sender: 'ai',
  },
];

export default function AIChat() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(welcomeMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [historyReady, setHistoryReady] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const flatListRef = useRef(null);
  const currentUserIdRef = useRef(null);
  const hydratingRef = useRef(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      const height = event?.endCoordinates?.height ?? 0;
      setKeyboardHeight(height);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const loadChatHistory = useCallback(async () => {
    hydratingRef.current = true;
    setHistoryReady(false);
    setMessages(welcomeMessages);
    currentUserIdRef.current = null;

    try {
      const currentUser = await account.get();
      const prefs = await account.getPrefs();
      const savedMessages = prefs?.aiChatData?.messages;

      currentUserIdRef.current = currentUser.$id;

      if (Array.isArray(savedMessages) && savedMessages.length > 0) {
        setMessages(savedMessages);
      }
    } catch (error) {
      setMessages(welcomeMessages);
    } finally {
      hydratingRef.current = false;
      setHistoryReady(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadChatHistory();
    }, [loadChatHistory])
  );

  useEffect(() => {
    if (!historyReady || hydratingRef.current || !currentUserIdRef.current) {
      return;
    }

    const persistHistory = async () => {
      try {
        const currentUser = await account.get();

        if (currentUser.$id !== currentUserIdRef.current) {
          return;
        }

        const prefs = await account.getPrefs();
        await account.updatePrefs({
          ...(prefs || {}),
          aiChatData: {
            messages,
          },
        });
      } catch (error) {
        console.log('Erro ao guardar histórico da IA:', error);
      }
    };

    persistHistory();
  }, [historyReady, messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { id: Date.now().toString(), text: input.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch("https://pap-lcm3.onrender.com/ai", {
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

  useEffect(() => {
    if (flatListRef.current) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [keyboardHeight]);

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assistente IA</Text>
        <Text style={styles.headerSubtitle}>Especialista em Finanças</Text>
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.list}
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
        keyboardShouldPersistTaps="handled"
      />

      {isLoading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>A pensar...</Text>
        </View>
      )}

      <View style={[styles.composer, { bottom: insets.bottom + Math.max(keyboardHeight - 90, -30) }]}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 15, 
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: colors.ink },
  headerSubtitle: { fontSize: 15, color: colors.muted, marginTop: 2 },
  list: { flex: 1 },
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 84,
    flexGrow: 1,
  },

  messageWrapper: { marginVertical: 6, flexDirection: 'row' },
  userWrapper: { justifyContent: 'flex-end' },
  aiWrapper: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '85%', paddingVertical: 13, paddingHorizontal: 18, borderRadius: radius.lg },
  userBubble: { backgroundColor: colors.primary, borderBottomRightRadius: 6 },
  aiBubble: { 
    backgroundColor: colors.surface, 
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  messageText: { fontSize: 16, lineHeight: 23 },
  userText: { color: '#fff' },
  aiText: { color: colors.ink },

  loadingWrapper: { flexDirection: 'row', justifyContent: 'center', padding: 12 },
  loadingText: { marginLeft: 8, color: colors.muted },

  composer: {
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  inputArea: { 
    paddingHorizontal: 16, 
    paddingTop: 8,
    backgroundColor: colors.background,
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.surface, 
    borderRadius: 30, 
    paddingHorizontal: 10, 
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  input: { 
    flex: 1, 
    paddingHorizontal: 16, 
    fontSize: 16, 
    maxHeight: 110,
    paddingVertical: 12,
  },
  sendButton: { 
    backgroundColor: colors.primary, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendDisabled: { backgroundColor: colors.faint },
}); 
