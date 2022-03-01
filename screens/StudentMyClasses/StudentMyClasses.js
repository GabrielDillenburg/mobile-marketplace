/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { Separator, Text } from 'native-base';
import { observer } from 'mobx-react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/core';
import { flowResult } from 'mobx';

import Colors from '../../constants/Colors';
import rem from '../../utils/rem';
import Button from '../../components/Button/Button';
import NBCard from '../../components/Card/Card';
import { useStore } from '../../hooks';
import { scheduleString } from '../../utils/timeFunctions';

const StudentMyClasses = observer(() => {
  const navigation = useNavigation();
  const store = useStore();
  const [mounted, setMounted] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Desfaça os comentários reativar a paginação
  // const [page, setPage] = useState(1);

  // const handleEndReached = async () => {
  //   if (store.classDataStore.occurrencesIsComplete) return;
  //   setPage(page + 1);
  // };

  // const fetchOccurrencesByPage = async (_page) => {
  //   setIsFetching(true);
  //   await flowResult(store.classDataStore.fetchOccurrences(_page));
  //   setIsFetching(false);
  // };

  const defaultingModal = () => {
    store.uiStore.modal({
      type: 'alert',
      title: 'ops!',
      subtitle:
        'Aparentemente você esta com débitos, entre em financeiro e atualize seus dados de faturamento',
    });
  };

  const init = async () => {
    // setPage(1);
    setIsFetching(true);
    let res = await flowResult(store.classDataStore.verifyStudent(store?.studentStore?.student?.id));
    console.log('ver',res);

    if (res) {
      await flowResult(store.classDataStore.fetchOccurrences(1));
      setIsFetching(false);
      setMounted(true);
    } else {
      defaultingModal()
    }
  };

  // useEffect(() => {
  //   if (mounted) fetchOccurrencesByPage(page);
  // }, [page]);

  useEffect(() => {
    if (!mounted) init();
  }, []);

  const headerSection = (
    <>
      <View style={style.container}>
        <Text style={style.title}>Explore novas aulas</Text>
        <Text style={style.description}>
          Em explorar você pode pesquisar e procurar uma aula ideal para você!
        </Text>
        {/* Permite falsa navegação, exibindo cartões de aulas após "logar" */}
        <Button
          onPress={() => {
            navigation.navigate('Explore');
          }}
          full
        >
          <Text uppercase={false} style={style.buttonText}>
            Explorar
          </Text>
        </Button>
      </View>
      <Separator style={style.separator} />
      <Text style={[style.title, style.cardsSectionTitle]}>Minhas aulas</Text>
    </>
  );

  return (
    <View style={style.pageWrapper}>
      <FlatList
        data={store.classDataStore.classesOccurrences}
        contentContainerStyle={{ paddingBottom: rem(30) }}
        renderItem={({ item }) => (
          <View style={style.cardContainer}>
            <Text style={style.scheduleText}>{scheduleString(item)}</Text>
            <NBCard classData={item} isAssigned />
          </View>
        )}
        ListHeaderComponent={headerSection}
        keyExtractor={(_, index) => `${index}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          mounted ? (
            <View style={style.containerNoClasses}>
              <Text style={style.descriptionNoClasses}>
                Você ainda não se inscreveu em nenhuma aula... Explore e se
                inscreva na sua aula preferida!
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={observer(() =>
          !mounted && isFetching ? (
            <View style={style.loader}>
              <ActivityIndicator color={Colors.blue1} />
            </View>
          ) : null,
        )}
        refreshing={mounted && isFetching}
        onRefresh={init}
        onEndReachedThreshold={0.5}
        // onEndReached={handleEndReached}
      />
    </View>
  );
});

export default StudentMyClasses;

const style = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  loader: {
    paddingVertical: rem(30),
  },

  cardContainer: {
    paddingHorizontal: rem(30),
  },

  container: {
    padding: rem(30),
  },

  title: {
    fontSize: rem(24),
    color: Colors.black3,
    fontFamily: 'OpenSans_bold',
  },

  description: {
    fontSize: rem(16),
    color: Colors.grey2,
    paddingTop: rem(15),
    paddingBottom: rem(30),
    fontFamily: 'OpenSans_regular',
  },

  containerNoClasses: {
    padding: rem(30),
  },

  descriptionNoClasses: {
    fontSize: rem(16),
    color: Colors.grey2,
    paddingTop: rem(20),
    paddingBottom: rem(30),
    textAlign: 'center',
    fontFamily: 'OpenSans_regular',
  },

  separator: {
    height: rem(10),
    backgroundColor: Colors.grey9,
  },

  cardsSectionTitle: {
    paddingLeft: rem(30),
    paddingTop: rem(30),
  },

  buttonText: {
    fontSize: rem(16),
    color: Colors.white,
    fontFamily: 'OpenSans_bold',
  },

  googleText: {
    fontSize: rem(16),
    color: Colors.black3,
    fontFamily: 'OpenSans_regular',
  },

  simpleText: {
    fontSize: rem(18),
    color: '#65696B',
    textAlign: 'center',
    padding: rem(15),
    fontFamily: 'OpenSans_regular',
  },

  scheduleText: {
    fontSize: rem(18),
    fontFamily: 'OpenSans_semibold',
    color: '#434647',
    marginTop: rem(40),
  },

  image: {
    height: rem(100),
    width: 'auto',
    flex: 1,
  },
});
