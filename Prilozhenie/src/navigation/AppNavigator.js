import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryRecipesScreen from '../screens/CategoryRecipesScreen';
import MyRecipesScreen from '../screens/MyRecipesScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import SearchScreen from '../screens/SearchScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const menuItems = [
    { label: 'Главная', icon: 'home-outline', route: 'MainTabs', params: { screen: 'HomeTab' } },
    { label: 'Категории', icon: 'grid-outline', route: 'MainTabs', params: { screen: 'CategoriesTab' } },
    { label: 'Мои рецепты', icon: 'book-outline', route: 'MainTabs', params: { screen: 'MyRecipesTab' } },
    { label: 'Поиск', icon: 'search-outline', route: 'MainTabs', params: { screen: 'SearchTab' } },
  ];

  return (
    <DrawerContentScrollView {...props} style={styles.drawer}>
      <View style={styles.drawerHeader}>
        <Ionicons name="restaurant" size={36} color={COLORS.primary} />
        <Text style={styles.drawerTitle}>Рецепты</Text>
        <Text style={styles.drawerSubtitle}>Ваш помощник на кухне</Text>
      </View>
      <View style={styles.drawerMenu}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.drawerItem}
            onPress={() => {
              props.navigation.navigate(item.route, item.params);
              props.navigation.closeDrawer();
            }}
          >
            <Ionicons name={item.icon} size={22} color={COLORS.text} />
            <Text style={styles.drawerItemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </DrawerContentScrollView>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'CategoriesTab') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'MyRecipesTab') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'SearchTab') iconName = focused ? 'search' : 'search-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Главная' }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesScreen}
        options={{ tabBarLabel: 'Категории' }}
      />
      <Tab.Screen
        name="MyRecipesTab"
        component={MyRecipesScreen}
        options={{ tabBarLabel: 'Мои рецепты' }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{ tabBarLabel: 'Поиск' }}
      />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: COLORS.background,
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            ...FONTS.subtitle,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CategoryRecipes"
          component={CategoryRecipesScreen}
          options={({ route }) => ({
            title: route.params.categoryTitle,
          })}
        />
        <Stack.Screen
          name="AddRecipe"
          component={AddRecipeScreen}
          options={{ title: 'Новый рецепт' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
  },
  drawerHeader: {
    padding: 24,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 8,
  },
  drawerTitle: {
    ...FONTS.title,
    marginTop: 12,
  },
  drawerSubtitle: {
    ...FONTS.caption,
    marginTop: 4,
  },
  drawerMenu: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusSmall,
    gap: 14,
  },
  drawerItemText: {
    ...FONTS.body,
    fontWeight: '500',
  },
});
