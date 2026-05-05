import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <LinearGradient colors={[COLORS.background, COLORS.cream]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.inner}>
        <View style={styles.top}>
          <Text style={styles.badge}>Клуб в Минске, Беларусь</Text>
          <Text style={styles.title}>«Мама-Супер!»</Text>
          <Text style={styles.sub}>
            Справочник на первые два года: развитие и нормы, массаж и вода, речь, сон и кормления, нервная система — с позицией нейро-подхода команды клуба. Информация не заменяет врача.
          </Text>
        </View>
        <Image source={require('../../pril2/age-6-9.png')} style={styles.img} resizeMode="contain" />
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.9}
          >
            <Text style={styles.btnText}>Регистрация</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.foot}>Instagram: @klubmamasuper · @severina.neuropsy</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  inner: { flex: 1, padding: SIZES.paddingLarge, justifyContent: 'space-between' },
  top: { marginTop: 12 },
  badge: { ...FONTS.caption, color: COLORS.primaryDeep, marginBottom: 6, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.text, letterSpacing: 0.5 },
  sub: { ...FONTS.body, marginTop: 12, color: COLORS.textLight },
  img: { width: '100%', height: 180, marginVertical: 8 },
  row: { width: '100%' },
  btn: { backgroundColor: COLORS.primaryDeep, paddingVertical: 16, borderRadius: SIZES.radius, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  foot: { ...FONTS.small, textAlign: 'center', marginBottom: 8 },
});
