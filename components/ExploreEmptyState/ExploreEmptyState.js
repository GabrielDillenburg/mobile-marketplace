import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View } from 'native-base';
import PropTypes from 'prop-types';

import Text from '../Text/Text';
import rem from '../../utils/rem';
import Colors from '../../constants/Colors';
import NBButton from '../Button/Button';
import FeelingBlue from '../Svg/FeelingBlue';

/**
 *
 * @param {Navigation} goBack
 */
export default function ExploreEmptyState({ goBack, filterEmptyState = true }) {
  return (
    <View style={style.container}>
      <Text style={style.text}>
        {filterEmptyState
          ? ' Não encontramos nenhum resultado \n relacionado à sua pesquisa...'
          : 'Ainda não existe nenhuma aula disponível para você se cadastrar. Solicite a inclusão de aulas para o seu professor ou escola.'}
      </Text>
      <FeelingBlue />
      {filterEmptyState && (
        <View style={style.backButtonArea}>
          <NBButton full onPress={() => goBack()}>
            <Text fontWeight="semibold" color={Colors.grey9}>
              Voltar
            </Text>
          </NBButton>
        </View>
      )}
    </View>
  );
}

ExploreEmptyState.propTypes = {
  goBack: PropTypes.func,
  filterEmptyState: PropTypes.bool,
};

ExploreEmptyState.defaultProps = {
  goBack: null,
  filterEmptyState: true,
};

const style = EStyleSheet.create({
  container: {
    paddingTop: rem(30),
    alignItems: 'center',
  },

  text: {
    color: Colors.grey4,
    textAlign: 'center',
  },

  image: {
    aspectRatio: 1,
    width: '100%',
    height: 'auto',
    maxHeight: '90%',
    marginVertical: rem(30),
  },

  backButtonArea: {
    marginTop: rem(24),
  },
});
