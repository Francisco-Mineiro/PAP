import { Tabs, usePathname } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';      
import { colors } from '../src/theme';
import { FinanceProvider } from '../src/FinanceContext';


//Explica barra de navegação
export default function TabsLayout() {
  const pathname = usePathname();

  const hideTabBar = pathname === '/' || pathname === '/index' || pathname === '/autenticacao/Registar' ||  pathname === '/autenticacao/Login';
  return (
    <FinanceProvider>
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: hideTabBar 
          ? { display: 'none' }                    
          : styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,           
      }}
    >
      <Tabs.Screen
        name="barra/Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="barra/orçamento"
        options={{
          title: 'Orçamento',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="barra/despesas"
        options={{
          title: 'Despesas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="barra/conta"
        options={{
          title: 'Conta',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="barra/IA"
        options={{
          title: 'IA',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox" size={size} color={color} />
          ),
        }}

      />

     <Tabs.Screen name="barra/privacidade" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="autenticacao/Login" options={{ href: null }} />
      <Tabs.Screen name="autenticacao/Registar" options={{ href: null }} />
      <Tabs.Screen name="barra/editarPerfil" options={{ href: null }} />
      <Tabs.Screen name="barra/notificacoes" options={{ href: null }} />

      </Tabs>
      //Explica barra de navegação(fim)
    </FinanceProvider>
  );
} 

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    height: 70,
    paddingTop: 8,
    paddingBottom: 10,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 12,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabItem: {
    borderRadius: 16,
  },
});
