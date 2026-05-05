import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../theme';
import { CATEGORIES_MEAL, CATEGORIES_DISH } from '../data/recipes';
import CategoryCard from '../components/CategoryCard';

export default function CategoriesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('meal');

  const categories = activeTab === 'meal' ? CATEGORIES_MEAL : CATEGORIES_DISH;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Категории</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'meal' && styles.tabActive]}
          onPress={() => setActiveTab('meal')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'meal' && styles.tabTextActive,
            ]}
          >
            По приёму пищи
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dish' && styles.tabActive]}
          onPress={() => setActiveTab('dish')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'dish' && styles.tabTextActive,
            ]}
          >
            По типу блюда
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onPress={() =>
              navigation.navigate('CategoryRecipes', {
                categoryId: cat.id,
                categoryTitle: cat.title,
                type: activeTab,
              })
            }
            style={styles.gridItem}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 32,
  },
  title: {
    ...FONTS.title,
    fontSize: 28,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.border,
    borderRadius: SIZES.radiusSmall,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: SIZES.radiusSmall - 2,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    ...FONTS.body,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '47%',
    flexGrow: 1,
    minHeight: 110,
  },
});
