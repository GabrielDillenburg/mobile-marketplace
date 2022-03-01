import React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import { Text, Icon, Separator } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';

import { useStore } from '../../hooks';

import Avatar from '../../components/Avatar/Avatar';

import Colors from '../../constants/Colors';
import rem from '../../utils/rem';
import openUrl from '../../utils/openUrl';
import { flowResult } from 'mobx';

const StudentProfile = () => {
  const navigation = useNavigation();
  const store = useStore();

  const unauthenticate = () => {
    store.authStore.unauthenticate();
  };
  console.log(store?.studentStore?.student?.id);
  return (
    <ScrollView contentContainerStyle={style.container}>
      <View>
        <Pressable
          onPress={() => navigation.navigate('StudentData')}
          style={style.pressableAvatar}
        >
          <View style={style.studentPictureColumn}>
            <Avatar source={store?.studentStore?.student?.image} size={50} />
          </View>
          <View style={style.studentNameColumn}>
            <Text style={style.name}>
              {`${
                store?.studentStore?.student?.name
                  ? store.studentStore.student.name
                  : ''
              } ${
                store?.studentStore?.student?.lastName
                  ? store.studentStore.student.lastName
                  : ''
              }`}
            </Text>
            <Text style={style.label}>Meus dados</Text>
          </View>
          <View>
            <View>
              <Icon type="Entypo" name="chevron-right" style={style.icon} />
            </View>
          </View>
        </Pressable>
      </View>

      <View style={style.separator}>
        <Separator />
      </View>

      <Pressable
        style={style.pressableItem}
        onPress={() => {
          openUrl('https://edtech.com.br/termos-de-uso-da-plataforma/');
        }}
      >
        <View style={style.pressableItemContent}>
          <Icon type="MaterialIcons" name="article" style={style.icon} />
          <Text style={style.pressableItemText}>Termos de Uso</Text>
        </View>
        <View style={style.pressableItemRightIcon}>
          <Icon type="MaterialIcons" name="launch" style={style.icon} />
        </View>
      </Pressable>

      <View style={style.separator}>
        <Separator />
      </View>

      <Pressable
        style={style.pressableItem}
        onPress={() => {
          openUrl('https://edtech.com.br/politica-privacidade/');
        }}
      >
        <View style={style.pressableItemContent}>
          <Icon type="MaterialIcons" name="shield" style={style.icon} />
          <Text style={style.pressableItemText}>Política de Privacidade</Text>
        </View>
        <View style={style.pressableItemRightIcon}>
          <Icon type="MaterialIcons" name="launch" style={style.icon} />
        </View>
      </Pressable>

      <View style={style.separator}>
        <Separator />
      </View>

      <Pressable
        style={style.pressableItem}
        onPress={() => {
          flowResult(store?.studentStore?.webapp());
        }}
      >
        <View style={style.pressableItemContent}>
          <Icon
            type="MaterialIcons"
            name="account-balance-wallet"
            style={style.icon}
          />
          <Text style={style.pressableItemText}>Financeiro</Text>
        </View>
        <View style={style.pressableItemRightIcon}>
          <Icon type="MaterialIcons" name="launch" style={style.icon} />
        </View>
      </Pressable>

      <View style={style.separator}>
        <Separator />
      </View>

      <Pressable
        style={style.pressableItem}
        onPress={() => {
          openUrl('https://suporte.edtech.com.br/');
        }}
      >
        <View style={style.pressableItemContent}>
          <Icon type="MaterialIcons" name="help" style={style.icon} />
          <Text style={style.pressableItemText}>Ajuda</Text>
        </View>
        <View style={style.pressableItemRightIcon}>
          <Icon type="MaterialIcons" name="launch" style={style.icon} />
        </View>
      </Pressable>

      <View style={style.separator}>
        <Separator />
      </View>

      <Pressable
        style={style.pressableItem}
        onPress={() => {
          store.uiStore.modal({
            type: 'prompt',
            title: 'Sair',
            subtitle: 'Você deseja sair?',
            confirmCallback: unauthenticate,
          });
        }}
      >
        <View style={style.pressableItemContent}>
          <Icon
            fontSize={30}
            type="MaterialIcons"
            name="logout"
            style={style.icon}
          />
          <Text style={style.pressableItemText}>Sair</Text>
        </View>
      </Pressable>

      <Text style={style.appVersion}>v{Constants.manifest.version}</Text>
    </ScrollView>
  );
};

const style = EStyleSheet.create({
  container: {
    flex: 1,
    padding: rem(30),
    backgroundColor: Colors.absoluteWhite || 'white',
  },

  pressableAvatar: {
    height: rem(50),
    flexDirection: 'row',
    alignItems: 'center',
  },

  studentPictureColumn: {
    width: rem(70),
  },

  studentNameColumn: {
    flex: 1,
  },

  studentPicture: {
    borderRadius: rem(50),
    height: rem(50),
    width: rem(50),
  },

  name: {
    fontSize: rem(16),
    color: Colors.black3,
    paddingTop: rem(5),
    fontFamily: 'OpenSans_bold',
  },

  label: {
    fontSize: rem(14),
    color: Colors.label,
    paddingVertical: rem(5),
    fontFamily: 'OpenSans_regular',
  },

  icon: {
    color: Colors.blue1,
    fontSize: rem(26),
  },

  separator: {
    height: rem(2),
    marginVertical: rem(30),
    backgroundColor: Colors.grey9,
  },

  pressableItemText: {
    color: Colors.grey1,
    paddingLeft: rem(12),
    fontFamily: 'OpenSans_regular',
  },

  pressableItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pressableItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  appVersion: {
    color: Colors.label,
    marginTop: rem(40),
    fontSize: rem(14),
  },
});

export default observer(StudentProfile);
