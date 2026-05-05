import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../theme';
import { RECIPES } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return RECIPES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => ing.toLowerCase().includes(q))
    );
  }, [query]);

  const renderItem = ({ item }) => (
    <RecipeCard
      recipe={item}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Поиск</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Название или ингредиент..."
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.trim() === '' ? (
        <View style={styles.placeholder}>
          <Ionicons name="search" size={64} color={COLORS.border} />
          <Text style={styles.placeholderText}>
            Введите название блюда{'\n'}или ингредиент
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.placeholder}>
              <Ionicons name="sad-outline" size={64} color={COLORS.border} />
              <Text style={styles.placeholderText}>
                Ничего не найдено.{'\n'}Попробуйте другой запрос
              </Text>
            </View>
          }
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
  },
  title: {
    ...FONTS.title,
    fontSize: 28,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    ...FONTS.body,
    padding: 0,
  },
  list: {
    padding: SIZES.padding,
    paddingBottom: 32,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  placeholderText: {
    ...FONTS.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
});
