import { Tabs, usePathname } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';      

export default function TabsLayout() {
  const pathname = usePathname();

  const hideTabBar = pathname === '/' || pathname === '/index' || pathname === '/autenticacao/Registar' ||  pathname === '/autenticacao/Login';
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: hideTabBar 
          ? { display: 'none' }                    
          : { backgroundColor: '#fff' },           
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

    </Tabs>
  );
} 