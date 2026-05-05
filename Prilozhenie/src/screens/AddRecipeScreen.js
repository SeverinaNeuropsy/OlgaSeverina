import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SIZES } from '../theme';

const STORAGE_KEY = '@my_recipes';

export default function AddRecipeScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [time, setTime] = useState('');
  const [servings, setServings] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [difficulty, setDifficulty] = useState('Легко');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const updateIngredient = (text, index) => {
    const updated = [...ingredients];
    updated[index] = text;
    setIngredients(updated);
  };
  const removeIngredient = (index) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => setSteps([...steps, '']);
  const updateStep = (text, index) => {
    const updated = [...steps];
    updated[index] = text;
    setSteps(updated);
  };
  const removeStep = (index) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const saveRecipe = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название рецепта');
      return;
    }
    const filteredIngredients = ingredients.filter((i) => i.trim());
    const filteredSteps = steps.filter((s) => s.trim());

    if (filteredIngredients.length === 0) {
      Alert.alert('Ошибка', 'Добавьте хотя бы один ингредиент');
      return;
    }
    if (filteredSteps.length === 0) {
      Alert.alert('Ошибка', 'Добавьте хотя бы один шаг приготовления');
      return;
    }

    const recipe = {
      id: Date.now().toString(),
      title: title.trim(),
      image: image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600',
      time: parseInt(time) || 0,
      servings: parseInt(servings) || 1,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      fat: parseInt(fat) || 0,
      carbs: parseInt(carbs) || 0,
      difficulty,
      ingredients: filteredIngredients,
      steps: filteredSteps,
      categoryMeal: 'lunch',
      categoryDish: 'main_course',
      isUserRecipe: true,
    };

    try {
      const existing = await AsyncStorage.getItem(STORAGE_KEY);
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(recipe);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      Alert.alert('Готово!', 'Рецепт сохранён', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось сохранить рецепт');
    }
  };

  const difficulties = ['Легко', 'Средне', 'Сложно'];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={40} color={COLORS.textMuted} />
              <Text style={styles.imagePlaceholderText}>Добавить фото</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Название *</Text>
        <TextInput
          style={styles.input}
          placeholder="Например: Домашние пельмени"
          placeholderTextColor={COLORS.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Время (мин)</Text>
            <TextInput
              style={styles.input}
              placeholder="30"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={time}
              onChangeText={setTime}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Порции</Text>
            <TextInput
              style={styles.input}
              placeholder="4"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={servings}
              onChangeText={setServings}
            />
          </View>
        </View>

        <Text style={styles.label}>Сложность</Text>
        <View style={styles.difficultyRow}>
          {difficulties.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.difficultyBtn,
                difficulty === d && styles.difficultyBtnActive,
              ]}
              onPress={() => setDifficulty(d)}
            >
              <Text
                style={[
                  styles.difficultyText,
                  difficulty === d && styles.difficultyTextActive,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>КБЖУ (на порцию)</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              placeholder="ккал"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              placeholder="Б"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={protein}
              onChangeText={setProtein}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              placeholder="Ж"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={fat}
              onChangeText={setFat}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              placeholder="У"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={carbs}
              onChangeText={setCarbs}
            />
          </View>
        </View>

        <Text style={styles.label}>Ингредиенты *</Text>
        {ingredients.map((ing, idx) => (
          <View key={idx} style={styles.listRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder={`Ингредиент ${idx + 1}`}
              placeholderTextColor={COLORS.textMuted}
              value={ing}
              onChangeText={(t) => updateIngredient(t, idx)}
            />
            {ingredients.length > 1 && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeIngredient(idx)}
              >
                <Ionicons name="close" size={18} color={COLORS.danger} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={addIngredient}>
          <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.addBtnText}>Добавить ингредиент</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Шаги приготовления *</Text>
        {steps.map((step, idx) => (
          <View key={idx} style={styles.listRow}>
            <Text style={styles.stepNumber}>{idx + 1}</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder={`Шаг ${idx + 1}`}
              placeholderTextColor={COLORS.textMuted}
              value={step}
              onChangeText={(t) => updateStep(t, idx)}
              multiline
            />
            {steps.length > 1 && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeStep(idx)}
              >
                <Ionicons name="close" size={18} color={COLORS.danger} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={addStep}>
          <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.addBtnText}>Добавить шаг</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
          <Text style={styles.saveButtonText}>Сохранить рецепт</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.padding,
    paddingBottom: 48,
  },
  imagePicker: {
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    gap: 8,
  },
  imagePlaceholderText: {
    ...FONTS.caption,
  },
  label: {
    ...FONTS.body,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...FONTS.body,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  difficultyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  difficultyBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  difficultyText: {
    ...FONTS.body,
    color: COLORS.textMuted,
  },
  difficultyTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stepNumber: {
    ...FONTS.body,
    fontWeight: '700',
    color: COLORS.primary,
    width: 20,
  },
  removeBtn: {
    padding: 8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  addBtnText: {
    ...FONTS.body,
    color: COLORS.primary,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    ...FONTS.subtitle,
    color: COLORS.white,
  },
});
