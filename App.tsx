import {
    NavigationIndependentTree
} from '@react-navigation/native';
import React from 'react';
import {
    StyleSheet
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <NavigationIndependentTree>
      <SafeAreaProvider>
          <AppNavigator />
      </SafeAreaProvider>
    </NavigationIndependentTree>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    padding: 20,
  },
  text: {
    fontSize: 18,
  },
});

export default App;
