import React, { useEffect, useState, useCallback } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { StyleProvider } from 'native-base';
import { Provider as PaperProvider } from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Entypo } from '@expo/vector-icons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { flowResult } from 'mobx';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import createRootStore from './stores/createRootStore';
import { RootStoreProvider } from './hooks';

import RootNavigator from './navigations/RootNavigator';

import ToastMessage from './components/ToastMessage/ToastMessage';

import getLoginStoredData from './utils/getLoginStoredData';

import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';

import Layout from './constants/Layout';

enableScreens();

SplashScreen.preventAutoHideAsync();

export default function App() {
  EStyleSheet.build({ $rem: Layout.window.width / 414 });

  const [appIsReady, setAppIsReady] = useState(false);
  const [rootStore, setRootStore] = useState(null);

  const init = async () => {
    try {
      await Font.loadAsync(Entypo.font);

      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        OpenSans_bold: require('./assets/fonts/OpenSans-Bold.ttf'),
        OpenSans_regular: require('./assets/fonts/OpenSans-Regular.ttf'),
        OpenSans_semibold: require('./assets/fonts/OpenSans-SemiBold.ttf'),
      });

      const store = await createRootStore();
      setRootStore(store);

      const loginStoredData = await getLoginStoredData();

      if (loginStoredData) {
        const { googleToken, email, password } = loginStoredData;

        if (googleToken?.length) {
          const response = await flowResult(
            store.authStore.socialLogin(googleToken),
          );

          if (!response) {
            store.authStore.setSectionExpired(true);
          }

          return;
        }

        const response = await flowResult(
          store.authStore.authenticate(email, password),
        );

        if (!response) {
          store.authStore.setSectionExpired(true);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAppIsReady(true);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync();
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <SafeAreaProvider>
      <ActionSheetProvider>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <RootStoreProvider value={rootStore}>
            <StatusBar translucent={Platform.OS === 'android'} />
            <PaperProvider>
              <StyleProvider style={getTheme(material)}>
                <RootNavigator />
              </StyleProvider>
            </PaperProvider>
          </RootStoreProvider>
          <ToastMessage />
        </View>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
}

const styles = EStyleSheet.create({
  container: { flex: 1 },
});
