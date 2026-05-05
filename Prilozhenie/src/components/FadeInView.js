import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export default function FadeInView({ children, delay = 0, style }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(
      () =>
        Animated.timing(a, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(),
      delay
    );
    return () => clearTimeout(t);
  }, [a, delay]);
  return (
    <Animated.View style={[style, { opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
