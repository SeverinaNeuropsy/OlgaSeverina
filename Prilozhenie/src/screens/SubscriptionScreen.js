import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { PRICES, REQUISITES_TEXT, INCLUSION_PRO } from '../constants/payment';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { shareExportCsv, buildExportCsv } from '../services/payments';

export default function SubscriptionScreen() {
  const { user, hasAccess, subscription, confirmBankPayment, activateDemoHours } = useApp();
  const [note, setNote] = useState('');

  async function copyReq() {
    await Clipboard.setStringAsync(REQUISITES_TEXT);
    Alert.alert('Скопировано', 'Вставьте в банк-клиент при переводе');
  }

  function afterPayWeek() {
    Alert.alert('Подтвердите оплату', 'После зачисления на счёт нажмите «Платёж внесён»', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Платёж внесён (9 $ — первая неделя)',
        onPress: async () => {
          const r = await confirmBankPayment({ amountUsd: PRICES.WEEK_FIRST, planCode: 'first_week', note });
          if (r?.ok) Alert.alert('Успех', 'Добро пожаловать! Действие 7 дней, далее — помесячно 29 $ при продлении.');
        },
      },
    ]);
  }

  function afterPayMonth() {
    Alert.alert('Подтвердите оплату', 'После зачисления 29 $ нажмите «Платёж внесён»', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Платёж внесён (29 $ за месяц)',
        onPress: async () => {
          const r = await confirmBankPayment({ amountUsd: PRICES.MONTH, planCode: 'monthly_29', note });
          if (r?.ok) Alert.alert('Успех', `Активно до ${new Date(r.until).toLocaleDateString('ru-RU')}`);
        },
      },
    ]);
  }

  async function onExport() {
    try {
      const txt = await buildExportCsv();
      if (txt.split('\n').length <= 1) {
        Alert.alert('Пока пусто', 'Записи появятся после «Платёж внесён»');
        return;
      }
      await shareExportCsv();
    } catch (e) {
      Alert.alert('Ошибка', String(e?.message || e));
    }
  }

  if (!user) {
    return (
      <View style={styles.hold}>
        <Text style={styles.p}>Сначала пройдите регистрацию в начале сценария.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.sc}>
        <Text style={styles.h}>Подписка</Text>
        <Text style={styles.c}>
          Тариф: эквивалент 29 $ в месяц, или 9 $ за первую неделю, с дальнейшим автопродлением (ежемесячно) после оплаты по тем же
          реквизитам, пока вы пользуетесь сервисом. Точные суммы в рублях/бел. рублях рассчитывается вашим банком по курсу на день
          операции.
        </Text>
        <View style={styles.box}>
          <Text style={styles.boxT}>Статус</Text>
          <Text style={styles.p}>
            {hasAccess
              ? `Доступ открыт. Окончание: ${subscription.until ? new Date(subscription.until).toLocaleString('ru-RU') : '—'}`
              : 'Пока без оплаченного периода — материалы в режиме превью.'}
          </Text>
        </View>
        <Text style={styles.sub}>Реквизиты</Text>
        <View style={styles.rekv}>
          <Text style={styles.mono}>{REQUISITES_TEXT}</Text>
        </View>
        <TouchableOpacity style={styles.btn2} onPress={copyReq}>
          <Text style={styles.btn2T}>Скопировать реквизиты</Text>
        </TouchableOpacity>
        <Text style={styles.c}>{INCLUSION_PRO}</Text>
        <View style={styles.field}>
          <Text style={styles.l}>Комментарий к платежу (необязательно)</Text>
          <TextInput
            style={styles.inp}
            value={note}
            onChangeText={setNote}
            placeholder="Например, имя плательщика в банке"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={afterPayWeek}>
          <Text style={styles.btnT}>Я оплатил первую неделю (9 $)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOut} onPress={afterPayMonth}>
          <Text style={styles.btnOutT}>Я оплатил месяц (29 $)</Text>
        </TouchableOpacity>
        {__DEV__ && (
          <TouchableOpacity
            style={styles.demo}
            onPress={async () => {
              await activateDemoHours(48);
              Alert.alert('Демо 48 ч', 'Полный доступ для теста в Expo Go');
            }}
          >
            <Text style={styles.demoT}>Служебно: демо 48 ч (только dev)</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.sub}>Данные плательщиков (локально + экспорт)</Text>
        <Text style={styles.c}>
          В приложении ведётся учёт: имя, страна, дата, сумма, какой по счету платёж от пользователя. Экспортируйте CSV и
          объединяйте с таблицей в папке pril3/pay на компьютере.
        </Text>
        <TouchableOpacity style={styles.btn2} onPress={onExport}>
          <Text style={styles.btn2T}>Экспорт CSV (копия для Excel)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hold: { flex: 1, padding: 20, backgroundColor: COLORS.background, justifyContent: 'center' },
  root: { flex: 1, backgroundColor: COLORS.background },
  sc: { padding: SIZES.padding, paddingBottom: 40 },
  h: { ...FONTS.title, marginBottom: 8 },
  sub: { ...FONTS.subtitle, marginTop: 16, marginBottom: 6 },
  c: { ...FONTS.caption, color: COLORS.textLight, marginBottom: 10, lineHeight: 20 },
  p: { ...FONTS.body, marginTop: 4 },
  box: { ...SHADOWS.light, backgroundColor: COLORS.surface, padding: 14, borderRadius: SIZES.radius, marginBottom: 8 },
  boxT: { ...FONTS.caption, fontWeight: '700', color: COLORS.primaryDeep },
  rekv: { backgroundColor: COLORS.cream, padding: 12, borderRadius: SIZES.radiusSmall, borderWidth: 1, borderColor: COLORS.border },
  mono: { ...FONTS.caption, fontFamily: 'monospace', lineHeight: 20 },
  btn: { backgroundColor: COLORS.primaryDeep, padding: 16, borderRadius: SIZES.radius, alignItems: 'center', marginTop: 8 },
  btnT: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnOut: { marginTop: 10, backgroundColor: COLORS.surface, padding: 16, borderRadius: SIZES.radius, alignItems: 'center', borderWidth: 2, borderColor: COLORS.primaryDeep },
  btnOutT: { color: COLORS.primaryDeep, fontSize: 16, fontWeight: '700' },
  btn2: { backgroundColor: COLORS.secondary, padding: 12, borderRadius: SIZES.radius, alignItems: 'center', marginTop: 8, marginBottom: 8 },
  btn2T: { color: '#fff', fontWeight: '600' },
  field: { marginTop: 8, marginBottom: 8 },
  l: { ...FONTS.caption, fontWeight: '600', marginBottom: 4 },
  inp: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusSmall, padding: 12, ...FONTS.body },
  demo: { marginTop: 12, padding: 10, alignItems: 'center' },
  demoT: { ...FONTS.small, color: COLORS.danger },
});
