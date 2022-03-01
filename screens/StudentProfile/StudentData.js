/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import { flowResult } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollView, View, Pressable, ActivityIndicator } from 'react-native';
import { Text, Separator, Icon } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/core';
import Toast from 'react-native-toast-message';

import { useStore } from '../../hooks';

import Avatar from '../../components/Avatar/Avatar';

import Colors from '../../constants/Colors';
import rem from '../../utils/rem';
import formatDate from '../../utils/formatDate';

import { SYSTEM_INSTABILITY } from '../../constants/Messages';

const StudentData = () => {
  const navigation = useNavigation();
  const store = useStore();

  const isDeletingAccount = useMemo(
    () => store.studentStore.isDeletingAccount,
    [store.studentStore.isDeletingAccount],
  );

  const deleteAccount = async () => {
    try {
      const res = await flowResult(store.studentStore.deleteAccount());

      store.uiStore.modalStore.hide();

      if (res) {
        Toast.show({
          type: 'success',
          text1: 'Conta excluída com sucesso.',
        });
        store.authStore.unauthenticate();
        return;
      }

      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
    } catch (error) {
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
    }
  };

  const data = {
    name: `${
      store?.studentStore?.student?.name
        ? store?.studentStore?.student?.name
        : ''
    } ${
      store?.studentStore?.student?.lastName
        ? store?.studentStore?.student?.lastName
        : ''
    }`,
    // school: 'Colégio Marista São Francisco',
    personalData: [
      {
        label: 'CPF',
        value: store?.studentStore?.student?.cpf,
      },
      {
        label: 'Data de Nascimento',
        value: formatDate(store?.studentStore?.student?.birthdate),
      },
      {
        label: 'Celular',
        value: `(${store?.studentStore?.student?.ddd?.trim()}) ${store?.studentStore?.student?.phone?.trim()}`,
      },
      {
        label: 'Email',
        value: store?.studentStore?.student?.email,
      },
    ],
    guardianData: [
      // {
      //   label: 'Nome',
      //   value: `${
      //     store?.responsibleStore?.responsible?.name
      //       ? store?.responsibleStore?.responsible?.name
      //       : ''
      //   } ${
      //     store?.responsibleStore?.responsible?.lastName
      //       ? store?.responsibleStore?.responsible?.lastName
      //       : ''
      //   }`,
      // },
      // {
      //   label: 'Grau de parentesco',
      //   value: store?.responsibleStore?.responsible?.relationship,
      // },
      // {
      //   label: 'CPF',
      //   value: store?.responsibleStore?.responsible?.cpf,
      // },
      // {
      //   label: 'Celular',
      //   value: `(${store?.responsibleStore?.responsible?.ddd?.trim()}) ${store?.responsibleStore?.responsible?.phone?.trim()}`,
      // },
      // {
      //   label: 'Email',
      //   value: store?.responsibleStore?.responsible?.email,
      // },
    ],
  };

  return (
    <ScrollView style={style.pageWrapper}>
      <>
        <View style={style.container}>
          {/* Specific view for student image and edit icon */}
          <View style={style.upperSection}>
            <Avatar source={store?.studentStore?.student?.image} size={85} />
            <Pressable
              onPress={() => navigation.navigate('StudentDataEdit')}
              style={style.editArea}
            >
              <Icon type="MaterialIcons" name="edit" style={style.editIcon} />
            </Pressable>
          </View>
          <Text style={style.header}>{data.name}</Text>
          {/* <Text style={style.school}>{data.school}</Text> */}
          {/* Looping over student's personal data */}
          {data.personalData.map((item, index) => (
            <View key={`personal${index}`}>
              <Text style={style.label}>{item.label}</Text>
              <Text style={style.value}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* <Separator style={style.separator} />
        <View style={style.container}>
          <Text style={style.header}>Dados do responsável</Text>
          {data.guardianData.map((item, index) => (
            <View key={`personal${index}`}>
              <Text style={style.label}>{item.label}</Text>
              <Text style={style.value}>{item.value}</Text>
            </View>
          ))}
        </View> */}
        <Separator style={style.separator} />
        <View style={style.container}>
          <Text style={style.header}>Excluir a conta</Text>
          <Text style={style.paragraph}>
            Sentimos muito que você queira deixar a - market. Uma vez que a
            conta é excluída, não é possível recuperá-la e todos os dados serão
            perdidos.
          </Text>

          {isDeletingAccount ? (
            <ActivityIndicator color={Colors.blue1} />
          ) : (
            <Text
              onPress={() => {
                store.uiStore.modal({
                  type: 'prompt',
                  title: 'Você tem certeza que deseja excluir sua conta?',
                  subtitle: 'Essa ação não poderá ser desfeita',
                  confirmCallback: deleteAccount,
                });
              }}
              style={style.link}
            >
              Excluir conta
            </Text>
          )}
        </View>
      </>
    </ScrollView>
  );
};

const style = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    // TODO: insert in Colors
    backgroundColor: Colors.absoluteWhite || 'white',
  },

  container: {
    padding: rem(30),
  },

  upperSection: {
    flex: 1,
    paddingBottom: rem(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  editArea: {
    padding: rem(20),
    right: rem(-20),
    top: rem(-20),
  },

  editIcon: {
    fontSize: rem(22),
    color: '#65696B',
  },

  header: {
    color: Colors.grey1,
    fontSize: rem(18),
    fontWeight: '600',
  },

  school: {
    color: Colors.grey2,
    fontSize: rem(12),
    paddingVertical: rem(5),
  },

  label: {
    color: Colors.label,
    fontSize: rem(12),
    paddingTop: rem(15),
  },

  value: {
    color: Colors.grey1,
    fontSize: rem(16),
    paddingTop: rem(5),
  },

  paragraph: {
    color: Colors.grey1,
    fontSize: rem(16),
    paddingVertical: rem(20),
  },

  link: {
    color: Colors.blue1,
    fontSize: rem(16),
    fontWeight: '700',
    paddingTop: rem(15),
  },

  separator: {
    height: rem(10),
    backgroundColor: Colors.grey9,
  },
});

export default observer(StudentData);
