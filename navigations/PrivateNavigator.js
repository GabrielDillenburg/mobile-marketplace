import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';

import Explore from '../screens/Explore/Explore';
import ExploreFilter from '../screens/Explore/ExploreFilter';
import StudentClassDetails from '../screens/StudentClassDetails/StudentClassDetails';
import StudentMyClasses from '../screens/StudentMyClasses/StudentMyClasses';
import StudentData from '../screens/StudentProfile/StudentData';
import StudentDataEdit from '../screens/StudentProfile/StudentDataEdit';
import StudentProfile from '../screens/StudentProfile/StudentProfile';

import ExploreIcon from '../components/Svg/ExploreIcon';
import ClassesIcon from '../components/Svg/ClassesIcon';
import ProfileIcon from '../components/Svg/ProfileIcon';
import Text from '../components/Text/Text';

import Colors from '../constants/Colors';
import rem from '../utils/rem';

const PrivateStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const getHeaderTitle = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Explore';
  switch (routeName) {
    case 'Explore': {
      return 'Explorar';
    }

    case 'StudentMyClasses': {
      return 'Minhas aulas';
    }

    case 'StudentProfile': {
      return 'Perfil';
    }

    default: {
      return '';
    }
  }
};

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

const TabNavigator = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case 'Explore': {
              return <ExploreIcon active={focused} />;
            }

            case 'StudentMyClasses': {
              return <ClassesIcon active={focused} />;
            }

            case 'StudentProfile': {
              return <ProfileIcon active={focused} />;
            }

            default: {
              return null;
            }
          }
        },
      })}
      tabBarOptions={{
        showIcon: true,
        activeTintColor: Colors.black1,
        inactiveTintColor: Colors.grey11,
        style: style.tabBar,
        labelStyle: {
          fontSize: rem(14),
          fontFamily: 'OpenSans_regular',
          transform: [{ translateY: rem(6) }],
        },
      }}
    >
      <Tab.Screen
        name="Explore"
        options={{
          tabBarLabel: 'Explorar',
          headerStyle,
          headerTintColor,
          headerTitleStyle,
        }}
        component={Explore}
      />
      <Tab.Screen
        name="StudentMyClasses"
        options={{
          tabBarLabel: 'Minhas aulas',
          headerStyle,
          headerTintColor,
          headerTitleStyle,
        }}
        component={StudentMyClasses}
      />
      <Tab.Screen
        name="StudentProfile"
        options={{
          tabBarLabel: 'Perfil',
          headerStyle,
          headerTintColor,
          headerTitleStyle,
        }}
        component={StudentProfile}
      />
    </Tab.Navigator>
  </SafeAreaView>
);

const PrivateNavigator = () => (
  <PrivateStack.Navigator initialRouteName="TabNavigator">
    <PrivateStack.Screen
      name="TabNavigator"
      component={TabNavigator}
      options={({ route }) => ({
        title: null,
        headerLeft: () => (
          <Text
            fontSize={24}
            fontWeight="bold"
            color={headerTintColor}
            style={style.headerTitle}
          >
            {getHeaderTitle(route)}
          </Text>
        ),
        headerStyle,
        headerTintColor,
        headerTitleStyle,
      })}
    />
    <PrivateStack.Screen
      name="StudentClassDetails"
      component={StudentClassDetails}
      options={{
        title: 'Detalhes da aula',
        headerStyle,
        headerTintColor,
        headerTitleStyle,
      }}
    />
    <PrivateStack.Screen
      name="StudentData"
      component={StudentData}
      options={{
        title: 'Meus dados',
        headerStyle,
        headerTintColor,
        headerTitleStyle,
      }}
    />
    <PrivateStack.Screen
      name="StudentDataEdit"
      component={StudentDataEdit}
      options={{
        title: 'Editar perfil',
        headerStyle,
        headerTintColor,
        headerTitleStyle,
      }}
    />
    <PrivateStack.Screen
      name="ExploreFilter"
      component={ExploreFilter}
      options={{
        title: 'Filtro',
        headerStyle,
        headerTintColor,
        headerTitleStyle,
      }}
    />
  </PrivateStack.Navigator>
);

const style = EStyleSheet.create({
  headerTitle: {
    position: 'absolute',
    left: rem(10),
  },
  tabBar: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    minHeight: rem(65),
    paddingBottom: rem(16),
    paddingTop: rem(16),
  },
});

export default PrivateNavigator;
