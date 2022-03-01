/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { flowResult } from 'mobx';
import { observer } from 'mobx-react';

import { useStore } from '../../hooks';
import rem from '../../utils/rem';
import ExploreEmptyState from '../../components/ExploreEmptyState/ExploreEmptyState';
import Colors from '../../constants/Colors';
import NBCard from '../../components/Card/Card';
import SearchBar from './SearchBar';

/**
 * @file Explore screen rendering a flatlist with the cards of all the classes available for the student and a search bar component with filter set as a sticky header on the flatlist.
 * Search result handled here via effect hook.
 */

const { height } = Dimensions.get('window');

const Explore = () => {
  const store = useStore();
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleEndReached = async () => {
    if (store.classDataStore.exploreIsComplete) return;
    setPage(page + 1);
  };

  const defaultingModal = () => {
    store.uiStore.modal({
      type: 'alert',
      title: 'ops!',
      subtitle:
        'Aparentemente você esta com débitos, entre em financeiro e atualize seus dados de faturamento',
    });
  };

  const fetchClassesByPage = async (_page) => {
    setIsFetching(true);
    await flowResult(store.classDataStore.fetchClasses(_page));
    setIsFetching(false);
  };

  const init = async () => {
    setPage(1);
    setIsFetching(true);
    console.log(store?.studentStore?.student);
    let res = await flowResult(store.classDataStore.verifyStudent(store?.studentStore?.student?.id));
    if (res) {
      await flowResult(store.classDataStore.fetchClasses(1));
      setIsFetching(false);
      setMounted(true);
    } else {
      defaultingModal()
    }
  };

  useEffect(() => {
    if (mounted) fetchClassesByPage(page);
  }, [page]);

  useEffect(() => {
    if (!mounted) init();
  }, []);

  return (
    <View style={style.pageWrapper}>
      <FlatList
        data={store.classDataStore.classesList}
        contentContainerStyle={{ paddingVertical: rem(30) }}
        renderItem={({ item }) => (
          <View style={style.container}>
            <NBCard classData={item} />
          </View>
        )}
        keyExtractor={(_, index) => `${index}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          mounted ? <ExploreEmptyState filterEmptyState={false} /> : null
        }
        ListHeaderComponent={
          <SearchBar showFilter setIsFetching={setIsFetching} />
        }
        ListHeaderComponentStyle={style.headerContainer}
        stickyHeaderIndices={[0]}
        ListFooterComponent={observer(() =>
          !mounted && isFetching ? (
            <View style={style.loaderArea}>
              <ActivityIndicator color={Colors.blue1} />
            </View>
          ) : null,
        )}
        refreshing={mounted && isFetching}
        onRefresh={init}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
      />
    </View>
  );
};

const style = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: rem(30),
    // paddingTop: rem(20),
    // paddingBottom: rem(30),
  },

  container: {
    marginTop: rem(30),
  },

  loaderArea: {
    flex: 1,
    marginVertical: height * 0.3,
  },

  headerContainer: {
    paddingTop: rem(15),
    backgroundColor: 'white',
  },
});

export default observer(Explore);
