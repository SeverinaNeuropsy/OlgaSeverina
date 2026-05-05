import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <Text style={styles.metaValue}>{recipe.time}</Text>
            <Text style={styles.metaLabel}>мин</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={20} color={COLORS.primary} />
            <Text style={styles.metaValue}>{recipe.servings}</Text>
            <Text style={styles.metaLabel}>порц.</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="speedometer-outline" size={20} color={COLORS.primary} />
            <Text style={styles.metaValue}>{recipe.difficulty}</Text>
          </View>
        </View>

        {(recipe.calories > 0 || recipe.protein > 0) && (
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionTitle}>Пищевая ценность (на порцию)</Text>
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.calories}</Text>
                <Text style={styles.nutritionLabel}>ккал</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.protein}</Text>
                <Text style={styles.nutritionLabel}>белки, г</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.fat}</Text>
                <Text style={styles.nutritionLabel}>жиры, г</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.carbs}</Text>
                <Text style={styles.nutritionLabel}>углев., г</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="list-outline" size={18} color={COLORS.primary} />
            {'  '}Ингредиенты
          </Text>
          {recipe.ingredients.map((ing, idx) => (
            <View key={idx} style={styles.ingredientRow}>
              <View style={styles.bullet} />
              <Text style={styles.ingredientText}>{ing}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="restaurant-outline" size={18} color={COLORS.primary} />
            {'  '}Приготовление
          </Text>
          {recipe.steps.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>{idx + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width,
    height: width * 0.65,
    backgroundColor: COLORS.border,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    backgroundColor: COLORS.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  content: {
    padding: SIZES.paddingLarge,
    marginTop: -20,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radiusLarge,
    borderTopRightRadius: SIZES.radiusLarge,
  },
  title: {
    ...FONTS.title,
    fontSize: 26,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
    ...SHADOWS.light,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metaValue: {
    ...FONTS.body,
    fontWeight: '700',
    color: COLORS.text,
  },
  metaLabel: {
    ...FONTS.small,
  },
  metaDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  nutritionCard: {
    backgroundColor: COLORS.accent + '30',
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 24,
  },
  nutritionTitle: {
    ...FONTS.caption,
    fontWeight: '600',
    color: COLORS.accentDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    ...FONTS.subtitle,
    color: COLORS.text,
  },
  nutritionLabel: {
    ...FONTS.small,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...FONTS.subtitle,
    marginBottom: 14,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    gap: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  ingredientText: {
    ...FONTS.body,
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  stepNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    ...FONTS.caption,
    fontWeight: '700',
    color: COLORS.white,
  },
  stepText: {
    ...FONTS.body,
    flex: 1,
    lineHeight: 22,
  },
});
