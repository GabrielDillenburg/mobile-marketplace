import React from 'react';
import { Icon, View } from 'native-base';
import { Dimensions, Pressable, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import { flowResult } from 'mobx';
import { observer } from 'mobx-react';

import rem from '../../utils/rem';
import Colors from '../../constants/Colors';
import { useStore } from '../../hooks';

/**
 * @file searchbar component exclusive to the explore and filter screens.
 */

const { width } = Dimensions.get('window');

const SearchBar = observer(
  ({ showFilter = false, setIsFetching = () => '' }) => {
    const store = useStore();
    const navigation = useNavigation();

    const search = async () => {
      setIsFetching(true);
      await flowResult(store.classDataStore.fetchClasses(1));
      setIsFetching(false);
    };

    return (
      <View style={style.searchView}>
        <Icon type="Feather" name="search" style={style.searchIcon} />
        <TextInput
          value={store.classDataStore.filterTitle}
          placeholder="Qual aula você deseja?"
          style={style.search}
          onChangeText={(value) => {
            store.classDataStore.setFilterTitle(value);
          }}
          returnKeyType="search"
          onSubmitEditing={search}
          blurOnSubmit
        />
        {showFilter && (
          <Pressable
            style={style.filterArea}
            onPress={() => navigation.navigate('ExploreFilter')}
          >
            <Icon
              type="MaterialCommunityIcons"
              name="filter-variant"
              style={{
                fontSize: rem(22),
                color: !(
                  store.classDataStore.filterTitle ||
                  store.classDataStore.filterAgeGroup.length > 0 ||
                  store.classDataStore.filterIsOnline !== null
                )
                  ? Colors.label
                  : Colors.blue1,
              }}
              onPress={() => navigation.navigate('ExploreFilter')}
            />
          </Pressable>
        )}
      </View>
    );
  },
);

SearchBar.propTypes = {
  showFilter: PropTypes.bool,
};

SearchBar.defaultProps = {
  showFilter: false,
};

export default SearchBar;

const style = EStyleSheet.create({
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
    fontFamily: 'OpenSans_regular',
  },

  searchIcon: {
    position: 'absolute',
    fontSize: rem(22),
    color: Colors.label,
    left: rem(20),
    zIndex: 1,
  },

  filterArea: {
    position: 'absolute',
    padding: rem(20),
    margin: rem(-20),
    right: rem(20),
    zIndex: 1,
  },

  filterIcon: {
    fontSize: rem(22),
    color: Colors.label,
  },
});
