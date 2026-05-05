import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AGE_GROUPS, AGE_IMAGES, SECTION_MENU } from '../data/ageGroups';
import { useApp } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import FadeInView from '../components/FadeInView';

function openInRootStack(navigation, name) {
  const stack = navigation.getParent()?.getParent?.() || navigation.getParent();
  if (stack?.navigate) stack.navigate(name);
}

export default function HomeScreen({ navigation }) {
  const { selectedAge, setSelectedAge, user, hasAccess, subscription, demoUntil } = useApp();
  const img = AGE_IMAGES[selectedAge];

  const subLine =
    hasAccess
      ? `Доступ активен${demoUntil > Date.now() ? ' (демо)' : ''} · до ${subscription.until ? new Date(subscription.until).toLocaleDateString('ru-RU') : '—'}`
      : 'Материалы доступны в демо-режиме. Подписка поддерживает проект и обновления.';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>
            {user ? `Здравствуйте, ${user.displayName}` : 'Клуб «Мама-Супер!»'}
          </Text>
          <Text style={styles.hint} numberOfLines={2}>
            {subLine}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Subscription')}
          style={styles.subBtn}
        >
          <Ionicons name="card-outline" size={24} color={COLORS.primaryDeep} />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={AGE_GROUPS}
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.ages}
        renderItem={({ item }) => {
          const on = item.id === selectedAge;
          return (
            <TouchableOpacity
              style={[styles.ageChip, on && styles.ageChipOn]}
              onPress={() => setSelectedAge(item.id)}
            >
              <Text style={[styles.ageTxt, on && styles.ageTxtOn]}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <ScrollView contentContainerStyle={styles.sc} showsVerticalScrollIndicator={false}>
        <FadeInView delay={0}>
          <View style={styles.hero}>
            {img ? <Image source={img} style={styles.heroImg} /> : null}
            <View style={styles.heroText}>
              <Text style={styles.ageTitle}>
                {AGE_GROUPS.find((a) => a.id === selectedAge)?.label}
              </Text>
              <Text style={styles.ageNote}>Фото в разделе — модель. Замените файлы в папке prilozhenie/pril2 по возрастам.</Text>
            </View>
          </View>
        </FadeInView>
        {SECTION_MENU.map((s, i) => (
          <FadeInView key={s.id} delay={80 * (i + 1)}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('SectionDetail', { sectionId: s.id, ageId: selectedAge })}
              activeOpacity={0.92}
            >
              <View style={styles.cardIcon}>
                <Ionicons name={s.icon} size={26} color={COLORS.primaryDeep} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardT}>{s.title}</Text>
                <Text style={styles.cardC}>
                  {hasAccess ? 'Открыть' : 'Открыть (демо без подписки)'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </FadeInView>
        ))}
        <View style={styles.legalLinks}>
          <Text style={styles.link} onPress={() => navigation.navigate('Preview')}>
            Все разделы одним экраном
          </Text>
          <Text style={styles.d}> · </Text>
          <Text style={styles.link} onPress={() => openInRootStack(navigation, 'Offer')}>
            Публичная оферта
          </Text>
          <Text style={styles.d}> · </Text>
          <Text style={styles.link} onPress={() => openInRootStack(navigation, 'Safety')}>
            Безопасность
          </Text>
          <Text style={styles.d}> · </Text>
          <Text style={styles.link} onPress={() => openInRootStack(navigation, 'DataSecurity')}>
            Данные
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', paddingHorizontal: SIZES.padding, paddingBottom: 8, alignItems: 'center' },
  hello: { ...FONTS.caption, fontWeight: '600', color: COLORS.primaryDeep },
  hint: { ...FONTS.small, maxWidth: '90%', marginTop: 2, color: COLORS.textLight },
  subBtn: { padding: 8, marginLeft: 8, ...SHADOWS.light, backgroundColor: COLORS.surface, borderRadius: 12 },
  ages: { paddingHorizontal: SIZES.padding, paddingBottom: 12, gap: 8 },
  ageChip: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  ageChipOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  ageTxt: { ...FONTS.caption, color: COLORS.text },
  ageTxtOn: { color: '#fff', fontWeight: '600' },
  sc: { padding: SIZES.padding, paddingBottom: 32 },
  hero: { marginBottom: 20, backgroundColor: COLORS.surface, borderRadius: SIZES.radius, overflow: 'hidden', ...SHADOWS.light },
  heroImg: { width: '100%', height: 200, backgroundColor: COLORS.cream },
  heroText: { padding: 14 },
  ageTitle: { ...FONTS.subtitle, marginBottom: 4 },
  ageNote: { ...FONTS.caption, color: COLORS.textLight },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.light },
  cardLock: { opacity: 0.95 },
  cardIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, marginLeft: 12 },
  cardT: { ...FONTS.subtitle, fontSize: 16, marginBottom: 2 },
  cardC: { ...FONTS.caption, color: COLORS.textLight },
  legalLinks: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16, marginBottom: 8 },
  link: { ...FONTS.caption, color: COLORS.primaryDeep, textDecorationLine: 'underline' },
  d: { color: COLORS.textMuted },
});
