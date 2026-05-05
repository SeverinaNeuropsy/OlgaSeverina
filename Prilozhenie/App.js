import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context/AppContext';
import MamaSuperNavigator from './src/navigation/MamaSuperNavigator';

export default function App() {
  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MamaSuperNavigator />
      </GestureHandlerRootView>
    </AppProvider>
  );
}
