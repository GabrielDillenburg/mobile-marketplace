import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { observer, Observer } from 'mobx-react';

import PublicNavigator from './PublicNavigator';
import PrivateNavigator from './PrivateNavigator';

import { useStore } from '../hooks';

import Modal from '../components/Modal/Modal';

import Colors from '../constants/Colors';
import rem from '../utils/rem';

const RootStack = createNativeStackNavigator();

const Navigator = () => {
  const store = useStore();

  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.white },
            headerTitleContainerStyle: { left: rem(30) },
          }}
        >
          {store.authStore.isAuthenticated ? (
            <RootStack.Screen
              name="private"
              component={PrivateNavigator}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <RootStack.Screen
              name="public"
              component={PublicNavigator}
              options={{
                headerShown: false,
              }}
            />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
      <Observer>{() => <Modal />}</Observer>
    </>
  );
};

export default observer(Navigator);
