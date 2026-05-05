import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../theme';
import { RECIPES } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';

export default function CategoryRecipesScreen({ route, navigation }) {
  const { categoryId, categoryTitle, type } = route.params;

  const filtered = RECIPES.filter((r) =>
    type === 'meal' ? r.categoryMeal === categoryId : r.categoryDish === categoryId
  );

  const renderItem = ({ item }) => (
    <RecipeCard
      recipe={item}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              В этой категории пока нет рецептов
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SIZES.padding,
    paddingBottom: 32,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
