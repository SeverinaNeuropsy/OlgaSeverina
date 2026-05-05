import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as paymentService from '../services/payments';

const KEY_USER = '@mamasuper_user_v1';
const KEY_SUB = '@mamasuper_sub_v1';
const KEY_AGE = '@mamasuper_age_v1';
const KEY_DEMO = '@mamasuper_demo_v1';
const FREE_PREVIEW_MODE = true;

const defaultUser = null;
const defaultSub = {
  active: false,
  until: 0,
  plan: null,
  autoRenew: true,
  firstWeekUsed: false,
  paymentCount: 0,
};

const AppContext = createContext(null);

function addMs(date, days) {
  return date + days * 24 * 60 * 60 * 1000;
}

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(defaultUser);
  const [subscription, setSubscription] = useState(defaultSub);
  const [selectedAge, setSelectedAge] = useState('0-3');
  const [demoUntil, setDemoUntil] = useState(0);
  const previewUser = useMemo(
    () => ({
      displayName: 'Гость',
      country: 'Беларусь',
      countryCode: 'BY',
      registeredAt: new Date(0).toISOString(),
    }),
    []
  );

  const load = useCallback(async () => {
    const [u, s, a, d] = await Promise.all([
      AsyncStorage.getItem(KEY_USER),
      AsyncStorage.getItem(KEY_SUB),
      AsyncStorage.getItem(KEY_AGE),
      AsyncStorage.getItem(KEY_DEMO),
    ]);
    if (u) setUser(JSON.parse(u));
    if (s) setSubscription((prev) => ({ ...prev, ...JSON.parse(s) }));
    if (a) setSelectedAge(a);
    if (d) setDemoUntil(Number(d, 10) || 0);
    setReady(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persistUser = useCallback(async (next) => {
    setUser(next);
    if (next) await AsyncStorage.setItem(KEY_USER, JSON.stringify(next));
    else await AsyncStorage.removeItem(KEY_USER);
  }, []);

  const persistSub = useCallback(async (next) => {
    setSubscription(next);
    await AsyncStorage.setItem(KEY_SUB, JSON.stringify(next));
  }, []);

  const register = useCallback(
    async ({ displayName, country, countryCode }) => {
      const next = {
        displayName: displayName.trim(),
        country: country.trim(),
        countryCode: (countryCode || '').trim() || '—',
        registeredAt: new Date().toISOString(),
      };
      await persistUser(next);
    },
    [persistUser]
  );

  const hasAccess = useMemo(() => {
    if (FREE_PREVIEW_MODE) return true;
    if (!user) return false;
    const now = Date.now();
    if (demoUntil > now) return true;
    if (!subscription.until) return false;
    return subscription.until > now;
  }, [user, subscription.until, demoUntil]);

  const isAuthorized = useMemo(() => FREE_PREVIEW_MODE || !!user, [user]);
  const currentUser = useMemo(() => user || (FREE_PREVIEW_MODE ? previewUser : null), [user, previewUser]);

  const activateDemoHours = useCallback(
    async (hours = 48) => {
      const until = Date.now() + hours * 60 * 60 * 1000;
      setDemoUntil(until);
      await AsyncStorage.setItem(KEY_DEMO, String(until));
    },
    []
  );

  const confirmBankPayment = useCallback(
    async ({ amountUsd, planCode, note = '' }) => {
      if (!user) return { ok: false, error: 'no_user' };
      const list = await paymentService.loadLocalPayments();
      const idxForUser = 1 + list.filter((p) => p.userName === user.displayName).length;
      const row = {
        userName: user.displayName,
        country: user.country,
        countryCode: user.countryCode,
        amountUsd: String(amountUsd),
        currency: 'USD',
        planCode: planCode || 'monthly',
        paymentIndexForUser: idxForUser,
        dateIso: new Date().toISOString(),
        note,
      };
      await paymentService.appendPaymentRow(row);
      const now = Date.now();
      let newUntil;
      const next = {
        ...subscription,
        paymentCount: (subscription.paymentCount || 0) + 1,
        autoRenew: true,
        active: true,
      };
      if (planCode === 'first_week' && !subscription.firstWeekUsed) {
        newUntil = addMs(now, 7);
        next.firstWeekUsed = true;
        next.until = newUntil;
        next.plan = 'first_week_then_monthly';
      } else {
        const base = Math.max(now, subscription.until || 0);
        newUntil = addMs(base, 30);
        next.until = newUntil;
        next.plan = 'monthly_29';
      }
      await persistSub(next);
      return { ok: true, until: newUntil };
    },
    [user, subscription, persistSub]
  );

  const extendSubscriptionFromPayment = useCallback(
    async (amountUsd, months = 1) => {
      if (!user) return;
      return confirmBankPayment({ amountUsd, planCode: 'monthly_29' });
    },
    [user, confirmBankPayment]
  );

  const setAge = useCallback(async (ageId) => {
    setSelectedAge(ageId);
    await AsyncStorage.setItem(KEY_AGE, ageId);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      user: currentUser,
      subscription,
      selectedAge,
      setSelectedAge: setAge,
      register,
      hasAccess,
      isAuthorized,
      freePreviewMode: FREE_PREVIEW_MODE,
      confirmBankPayment,
      extendSubscriptionFromPayment,
      activateDemoHours,
      demoUntil,
      persistUser,
      paymentService,
    }),
    [
      ready,
      currentUser,
      subscription,
      selectedAge,
      setAge,
      register,
      hasAccess,
      isAuthorized,
      confirmBankPayment,
      extendSubscriptionFromPayment,
      activateDemoHours,
      demoUntil,
      persistUser,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp outside AppProvider');
  return ctx;
}
