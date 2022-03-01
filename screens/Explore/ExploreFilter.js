/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View, Icon } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import { Dimensions, TextInput, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { observer } from 'mobx-react';
import { ActivityIndicator } from 'react-native-paper';
import { flowResult } from 'mobx';

import Button from '../../components/Button/Button';
import Colors from '../../constants/Colors';
import rem from '../../utils/rem';
import Text from '../../components/Text/Text';
import AgeGroups from '../../constants/AgeGroups';
import { useStore } from '../../hooks';
import CheckBox from '../../components/Selectors/CheckBox';

const { width } = Dimensions.get('window');

const filterInitialValues = {
  title: '',
  ageGroup: [],
  location: '',
};

const ExploreFilter = observer(() => {
  const store = useStore();
  const navigation = useNavigation();

  const [initialValues, setInitialValues] = useState({});

  const getLocationValue = (boolValue) =>
    boolValue === null ? NONE : boolValue ? ONLINE : INPERSON;

  const NONE = 0;
  const ONLINE = 1;
  const INPERSON = 2;

  const [location, setLocation] = useState(
    getLocationValue(store.classDataStore.filterIsOnline),
  );

  const calcLocation = (value) => {
    const factor = Math.round(Math.abs(location - value) / 2);
    return factor * value;
  };

  const onSubmit = async () => {
    await flowResult(store.classDataStore.fetchClasses());
    navigation.navigate('Explore');
  };

  useEffect(() => {
    setInitialValues({
      ...filterInitialValues,
      title: `${store.classDataStore.filterTitle}`,
      ageGroup: [...store.classDataStore.filterAgeGroup],
      location,
    });
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, setFieldValue, values, isSubmitting }) => (
        <ScrollView contentContainerStyle={style.pageWrapper}>
          <View style={style.container}>
            <Text style={style.textInputTitle} fontWeight="semibold">
              Curso
            </Text>
            <View style={style.searchView}>
              <Icon type="Feather" name="search" style={style.searchIcon} />
              <TextInput
                value={store.classDataStore.filterTitle}
                placeholder="Pesquisar"
                style={style.search}
                onChangeText={(value) => {
                  store.classDataStore.setFilterTitle(value);
                  setFieldValue('title', value);
                }}
                returnKeyType="next"
              />
            </View>
            <View style={style.divider} />
            <Text style={style.contentHeader} fontWeight="semibold">
              Faixa etária
            </Text>
            <View style={style.ageGroupFilter}>
              {Object.keys(AgeGroups)
                .filter((item) => item !== 'any')
                .map((item) => (
                  <View style={style.checkBoxWrapper} key={item}>
                    <CheckBox
                      size={24}
                      fontSize={16}
                      value={
                        store.classDataStore.filterAgeGroup.indexOf(item) > -1
                      }
                      label={AgeGroups[item]}
                      onCheck={() => {
                        const list = values.ageGroup;
                        const index = list.indexOf(item);
                        index > -1 ? list.splice(index, 1) : list.push(item);
                        setFieldValue('ageGroup', list);
                        store.classDataStore.setFilterAgeGroup(list);
                      }}
                    />
                  </View>
                ))}
            </View>
            <View style={style.divider} />
            <Text style={style.contentHeader} fontWeight="semibold">
              Local da aula
            </Text>

            <View style={style.checkBoxWrapper}>
              <CheckBox
                size={24}
                fontSize={16}
                label="Online"
                value={store.classDataStore.filterIsOnline === true}
                onCheck={() => {
                  const newLocation = calcLocation(ONLINE);
                  setLocation(newLocation);
                  setFieldValue('location', newLocation);
                  store.classDataStore.setFilterIsOnline(
                    newLocation === ONLINE ? true : null,
                  );
                }}
              />
            </View>

            <View style={style.checkBoxWrapper}>
              <CheckBox
                size={24}
                fontSize={16}
                label="Presencial"
                value={store.classDataStore.filterIsOnline === false}
                onCheck={() => {
                  const newLocation = calcLocation(INPERSON);
                  setLocation(newLocation);
                  setFieldValue('location', newLocation);
                  store.classDataStore.setFilterIsOnline(
                    newLocation === INPERSON ? false : null,
                  );
                }}
              />
            </View>

            <View style={style.showResultArea}>
              <Button
                full
                onPress={handleSubmit}
                backgroundColor={Colors.blue1}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text color="white" fontWeight="bold">
                    Ver resultados
                  </Text>
                )}
              </Button>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
});

export default ExploreFilter;

const style = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: rem(30),
  },

  container: {
    paddingTop: rem(20),
  },

  textInputTitle: {
    marginBottom: rem(8),
  },

  divider: {
    borderBottomColor: Colors.grey7,
    borderBottomWidth: rem(1),
    marginTop: rem(16),
    marginBottom: rem(24),
  },

  searchView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  search: {
    backgroundColor: Colors.grey10,
    borderRadius: rem(5),
    paddingLeft: rem(55),
    height: rem(50),
    width: width - rem(60),
    color: Colors.label,
    fontSize: rem(14),
  },

  searchIcon: {
    position: 'absolute',
    fontSize: rem(22),
    color: Colors.label,
    left: rem(20),
    zIndex: 1,
  },

  showResultArea: {
    marginTop: rem(32),
  },

  contentHeader: {
    marginBottom: rem(20),
  },

  checkBoxWrapper: {
    marginBottom: rem(16),
  },

  ageGroupFilter: {
    minHeight: rem(200),
  },
});
