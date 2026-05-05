import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, FONTS } from '../theme';

import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ClubScreen from '../screens/ClubScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import FullPreviewScreen from '../screens/FullPreviewScreen';
import SectionDetailScreen from '../screens/SectionDetailScreen';
import OfferScreen from '../screens/OfferScreen';
import SafetyScreen from '../screens/SafetyScreen';
import DataSecurityScreen from '../screens/DataSecurityScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border, height: 58, paddingTop: 6, paddingBottom: 8 },
        tabBarActiveTintColor: COLORS.primaryDeep,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ color, size }) => {
          const i =
            route.name === 'Home'
              ? 'home'
              : route.name === 'Club'
                ? 'heart'
                : route.name === 'Preview'
                  ? 'book'
                  : 'card';
          return <Ionicons name={i} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
      <Tab.Screen name="Preview" component={FullPreviewScreen} options={{ title: 'Все разделы' }} />
      <Tab.Screen name="Club" component={ClubScreen} options={{ title: 'Клуб' }} />
      <Tab.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ title: 'Оплата' }}
      />
    </Tab.Navigator>
  );
}

function AuthedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
        headerTintColor: COLORS.text,
        headerTitleStyle: { ...FONTS.subtitle, fontSize: 17 },
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="SectionDetail"
        component={SectionDetailScreen}
        options={({ route }) => {
          const t = { development: 'Развитие', massage: 'Массаж', swim: 'Ванна', speech: 'Речь', life: 'Быт', brain: 'Мозг' };
          return { title: t[route.params?.sectionId] || 'Раздел' };
        }}
      />
      <Stack.Screen name="Offer" component={OfferScreen} options={{ title: 'Оферта' }} />
      <Stack.Screen name="Safety" component={SafetyScreen} options={{ title: 'Безопасность' }} />
      <Stack.Screen name="DataSecurity" component={DataSecurityScreen} options={{ title: 'Данные и оплаты' }} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        headerTitleStyle: { ...FONTS.subtitle, fontSize: 17 },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Мама-Супер!' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Регистрация' }} />
    </Stack.Navigator>
  );
}

function Loading() {
  return (
    <View style={styles.load}>
      <ActivityIndicator size="large" color={COLORS.primaryDeep} />
    </View>
  );
}

export default function MamaSuperNavigator() {
  const { ready, isAuthorized } = useApp();
  if (!ready) return <Loading />;
  return <NavigationContainer>{isAuthorized ? <AuthedStack /> : <AuthStack />}</NavigationContainer>;
}

const styles = StyleSheet.create({
  load: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
});
