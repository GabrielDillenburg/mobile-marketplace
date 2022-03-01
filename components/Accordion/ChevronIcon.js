import React from 'react';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from '../../constants/Colors';
import rem from '../../utils/rem';

export default function ChevronIcon({ direction }) {
  return (
    <Icon
      type="Ionicons"
      name={`chevron-${direction}-outline`}
      style={style.chevron}
    />
  );
}

ChevronIcon.propTypes = {
  direction: PropTypes.string,
};

ChevronIcon.defaultProps = {
  direction: 'up',
};

const style = EStyleSheet.create({
  chevron: {
    // TODO: add to Colors
    color: Colors.chevron || '#65696B',
    fontSize: rem(16),
  },
});
