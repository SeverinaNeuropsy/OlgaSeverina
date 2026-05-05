import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SIZES } from '../theme';
import RecipeCard from '../components/RecipeCard';

const STORAGE_KEY = '@my_recipes';

export default function MyRecipesScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  );

  const loadRecipes = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setRecipes(JSON.parse(data));
    } catch (e) {
      console.warn('Ошибка загрузки рецептов', e);
    }
  };

  const deleteRecipe = (id) => {
    Alert.alert('Удалить рецепт?', 'Это действие нельзя отменить', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          const updated = recipes.filter((r) => r.id !== id);
          setRecipes(updated);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View>
      <RecipeCard
        recipe={item}
        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      />
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => deleteRecipe(item.id)}
      >
        <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Мои рецепты</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddRecipe')}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {recipes.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="book-outline" size={64} color={COLORS.border} />
          <Text style={styles.emptyText}>
            У вас пока нет своих рецептов.{'\n'}Нажмите «+», чтобы добавить первый!
          </Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...FONTS.title,
    fontSize: 28,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: SIZES.padding,
    paddingBottom: 32,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  deleteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.white,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
