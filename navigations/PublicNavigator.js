import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import RegisterResponsible from '../screens/RegisterResponsible/RegisterResponsible';
import DefinePassword from '../screens/RegisterResponsible/DefinePassword';
import rem from '../utils/rem';
import Colors from '../constants/Colors';

const PublicStack = createNativeStackNavigator();

const headerStyle = {
  backgroundColor: '#F7F7F7',
  elevation: 0,
  borderBottomWidth: 0,
  shadowOpacity: 0,
  shadowOffset: {
    height: 0,
  },
  shadowRadius: 0,
};

const headerTintColor = Colors.black3;

const headerTitleStyle = {
  fontWeight: 'bold',
  fontSize: rem(24),
  fontFamily: 'OpenSans_bold',
};

const PublicNavigator = () => (
  <PublicStack.Navigator initialRouteName="Login">
    <PublicStack.Screen
      name="Login"
      component={Login}
      options={{
        headerShown: false,
      }}
    />
    <PublicStack.Screen
      name="Register"
      component={Register}
      options={{
        title: 'Cadastro do aluno',
        headerStyle,
        headerTintColor,
        headerTitleStyle,
      }}
    />
    <PublicStack.Screen
      name="RegisterResponsible"
      component={RegisterResponsible}
      options={{
        title: 'Cadastro do Responsável',
        headerStyle,
        headerTintColor,
        headerTitleStyle,
      }}
    />
    <PublicStack.Screen
      name="DefinePassword"
      component={DefinePassword}
      options={{
        title: 'Definir Senha',
        headerStyle,
        headerTintColor,
        headerTitleStyle,
      }}
    />
  </PublicStack.Navigator>
);

export default PublicNavigator;
