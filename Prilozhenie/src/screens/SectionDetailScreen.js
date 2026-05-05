import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getCurriculum } from '../data/curriculum/data6m';
import { SECTION_MENU } from '../data/ageGroups';
import { useApp } from '../context/AppContext';
import VideoBlock from '../components/VideoBlock';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

function getPreview(sectionId, d) {
  if (!d) return '';
  if (sectionId === 'development' && d.development) return d.development.intro;
  if (sectionId === 'massage' && d.massage) return d.massage.intro;
  if (sectionId === 'swim' && d.swim) return d.swim.intro;
  if (sectionId === 'speech' && d.speech) return d.speech.intro;
  if (sectionId === 'life' && d.life) return d.life.intro;
  if (sectionId === 'brain' && d.brain) return d.brain.intro;
  return '';
}

export default function SectionDetailScreen({ route, navigation }) {
  const { sectionId, ageId } = route.params;
  const { hasAccess } = useApp();
  const data = getCurriculum(ageId);
  const title = SECTION_MENU.find((s) => s.id === sectionId)?.title || 'Раздел';
  const showFreeView = true;
  if (!data) {
    return (
      <View style={styles.hold}>
        <Text>Нет данных</Text>
      </View>
    );
  }
  if (!hasAccess && !showFreeView) {
    const prev = getPreview(sectionId, data);
    return (
      <ScrollView contentContainerStyle={styles.sc} style={styles.hold}>
        <Text style={styles.h1}>{title}</Text>
        <Text style={styles.previewLabel}>Превью (без подписки)</Text>
        <Text style={styles.p}>{prev}</Text>
        <View style={styles.pwIn}>
          <Text style={styles.pwT}>Оформите подписку</Text>
          <Text style={styles.pwC}>
            Доступ ко всем возрастам, текстам, структуре уроков и обновляемым видео. Платёж — перевод на счёт, данные карт в приложение не вводятся.
          </Text>
          <TouchableOpacity
            style={styles.pwB}
            onPress={() => navigation.navigate('Main', { screen: 'Subscription' })}
          >
            <Text style={styles.pwBtn}>Реквизиты и тарифы</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.hold}>
      <ScrollView contentContainerStyle={styles.sc}>
        {!hasAccess && showFreeView && (
          <View style={styles.demoBanner}>
            <Text style={styles.demoBannerTitle}>Демо-доступ к разделу</Text>
            <Text style={styles.demoBannerText}>
              Вы читаете полный раздел без подписки. Подписка нужна для поддержки проекта, обновляемого контента и сопровождения
              специалистов клуба.
            </Text>
            <TouchableOpacity
              style={styles.demoBannerBtn}
              onPress={() => navigation.navigate('Main', { screen: 'Subscription' })}
            >
              <Text style={styles.demoBannerBtnText}>Оформить подписку</Text>
            </TouchableOpacity>
          </View>
        )}
        {sectionId === 'development' && data.development && (
          <>
            <Text style={styles.h1}>{data.development.title}</Text>
            <Text style={styles.p}>{data.development.intro}</Text>
            <Text style={styles.h2}>{data.development.normsIntro}</Text>
            {data.development.norms.map((n, i) => (
              <View key={i} style={styles.nrow}>
                <Text style={styles.b}>• {n.skill}</Text>
                <Text style={styles.s}>{n.period}</Text>
              </View>
            ))}
            <Text style={styles.foot}>{data.development.footer}</Text>
          </>
        )}
        {sectionId === 'massage' && data.massage && (
          <>
            <Text style={styles.h1}>{data.massage.title}</Text>
            <Text style={styles.p}>{data.massage.intro}</Text>
            {data.massage.subsections.map((s) => (
              <View key={s.name} style={styles.sub}>
                <Text style={styles.h2}>{s.name}</Text>
                <Text style={styles.p}>{s.text}</Text>
              </View>
            ))}
            {data.massage.videos?.map((v, i) => (
              <VideoBlock key={i} title={v.title} url={v.url} note={v.note} />
            ))}
          </>
        )}
        {sectionId === 'swim' && data.swim && (
          <>
            <Text style={styles.h1}>{data.swim.title}</Text>
            <Text style={styles.p}>{data.swim.intro}</Text>
            <View style={styles.warn}>
              <Text style={styles.warnT}>Безопасность</Text>
              <Text style={styles.p}>{data.swim.safety}</Text>
            </View>
            {data.swim.videos?.map((v, i) => (
              <VideoBlock key={i} title={v.title} url={v.url} note={v.note} />
            ))}
          </>
        )}
        {sectionId === 'speech' && data.speech && (
          <>
            <Text style={styles.h1}>{data.speech.title}</Text>
            <Text style={styles.p}>{data.speech.intro}</Text>
            <Text style={styles.h2}>Упражнения для мам (на русском)</Text>
            {data.speech.momExercises.map((e, i) => (
              <Text key={i} style={styles.p}>
                {i + 1}. {e}
              </Text>
            ))}
          </>
        )}
        {sectionId === 'life' && data.life && (
          <>
            <Text style={styles.h1}>{data.life.title}</Text>
            <Text style={styles.p}>{data.life.intro}</Text>
            {data.life.sections.map((b) => (
              <View key={b.h} style={styles.sub}>
                <Text style={styles.h2}>{b.h}</Text>
                <Text style={styles.p}>{b.body}</Text>
              </View>
            ))}
          </>
        )}
        {sectionId === 'brain' && data.brain && (
          <>
            <Text style={styles.h1}>{data.brain.title}</Text>
            <Text style={styles.p}>{data.brain.intro}</Text>
            {data.brain.points.map((p, i) => (
              <Text key={i} style={styles.p}>
                — {p}
              </Text>
            ))}
            <Text style={styles.foot}>
              Следите за обновлениями @klubmamasuper и @severina.neuropsy — наполнение согласуется с руководителем и специалистами клуба.
            </Text>
          </>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hold: { flex: 1, backgroundColor: COLORS.background },
  sc: { padding: SIZES.padding, paddingTop: 8 },
  previewLabel: { ...FONTS.caption, color: COLORS.primaryDeep, fontWeight: '600', marginBottom: 6 },
  h1: { ...FONTS.title, marginBottom: 10 },
  h2: { ...FONTS.subtitle, fontSize: 16, marginTop: 12, marginBottom: 6, color: COLORS.primaryDeep },
  p: { ...FONTS.body, marginBottom: 8 },
  nrow: { marginBottom: 6, ...SHADOWS.light, backgroundColor: COLORS.surface, padding: 10, borderRadius: SIZES.radiusSmall },
  b: { ...FONTS.body, fontWeight: '600' },
  s: { ...FONTS.caption, marginTop: 2 },
  foot: { ...FONTS.caption, marginTop: 12, color: COLORS.textLight, fontStyle: 'italic' },
  sub: { marginBottom: 4 },
  warn: { backgroundColor: COLORS.cream, borderRadius: SIZES.radiusSmall, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: COLORS.border },
  warnT: { ...FONTS.subtitle, fontSize: 15, marginBottom: 4, color: COLORS.danger },
  pwIn: { marginTop: 20, padding: SIZES.padding, backgroundColor: COLORS.surface, borderRadius: SIZES.radius, ...SHADOWS.medium, borderWidth: 1, borderColor: COLORS.border },
  pwT: { ...FONTS.title, textAlign: 'center', marginBottom: 6 },
  pwC: { ...FONTS.caption, textAlign: 'left', color: COLORS.textLight, marginBottom: 14 },
  pwB: { backgroundColor: COLORS.primaryDeep, padding: 16, borderRadius: SIZES.radius, alignItems: 'center' },
  pwBtn: { color: '#fff', fontSize: 17, fontWeight: '700' },
  demoBanner: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSmall,
  },
  demoBannerTitle: { ...FONTS.subtitle, fontSize: 15, marginBottom: 4, color: COLORS.primaryDeep },
  demoBannerText: { ...FONTS.caption, color: COLORS.text, marginBottom: 8 },
  demoBannerBtn: { alignSelf: 'flex-start', backgroundColor: COLORS.primaryDeep, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  demoBannerBtnText: { color: '#fff', fontWeight: '600' },
});
