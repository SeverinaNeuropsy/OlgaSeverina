import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

const COUNTRIES = [
  { n: 'Беларусь', c: 'BY' },
  { n: 'Россия', c: 'RU' },
  { n: 'Другая', c: 'XX' },
];

export default function RegisterScreen({ navigation }) {
  const { register } = useApp();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Беларусь');
  const [countryCode, setCountryCode] = useState('BY');
  const [saving, setSaving] = useState(false);

  async function onSave() {
    if (!name.trim()) {
      Alert.alert('Введите имя', 'Как к вам обращаться в приложении');
      return;
    }
    setSaving(true);
    try {
      await register({ displayName: name, country, countryCode });
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.sc} keyboardShouldPersistTaps="handled">
          <Text style={styles.h}>Регистрация</Text>
          <Text style={styles.caption}>
            Адрес и карту мы не просим: данные — для договора-оферты, учёта подписки и при необходимости связи по оплате.
          </Text>
          <View style={styles.field}>
            <Text style={styles.l}>Как вас зовут</Text>
            <TextInput
              style={styles.inp}
              value={name}
              onChangeText={setName}
              placeholder="Например, Аня"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.l}>Страна (приблизительно)</Text>
            <View style={styles.pills}>
              {COUNTRIES.map((o) => (
                <TouchableOpacity
                  key={o.c}
                  style={[styles.pill, country === o.n && styles.pillOn]}
                  onPress={() => {
                    setCountry(o.n);
                    setCountryCode(o.c);
                  }}
                >
                  <Text style={[styles.pillT, country === o.n && styles.pillTOn]}>{o.n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.btn, saving && { opacity: 0.7 }]}
            onPress={onSave}
            disabled={saving}
          >
            <Text style={styles.btnT}>Сохранить и войти</Text>
          </TouchableOpacity>
          <Text style={styles.legal} onPress={() => navigation.navigate('Offer')}>
            Продолжая, вы соглашаетесь с условиями публичной оферты
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  sc: { padding: SIZES.paddingLarge, paddingBottom: 40 },
  h: { ...FONTS.title, marginBottom: 8 },
  caption: { ...FONTS.caption, marginBottom: 20, color: COLORS.textLight },
  field: { marginBottom: 16 },
  l: { ...FONTS.caption, marginBottom: 6, fontWeight: '600', color: COLORS.text },
  inp: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusSmall,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...FONTS.body,
  },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  pillOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pillT: { ...FONTS.caption, color: COLORS.text },
  pillTOn: { color: '#fff', fontWeight: '600' },
  btn: { marginTop: 8, backgroundColor: COLORS.primaryDeep, padding: 16, borderRadius: SIZES.radius, alignItems: 'center' },
  btnT: { color: '#fff', fontSize: 17, fontWeight: '700' },
  legal: { ...FONTS.small, color: COLORS.primaryDeep, textDecorationLine: 'underline', marginTop: 16, textAlign: 'center' },
});
