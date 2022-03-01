import React from 'react';
import { CardItem, Col, Text } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import ChevronIcon from './ChevronIcon';
import rem from '../../utils/rem';

export default function AccordionHeader({ title, direction, onPress }) {
  return (
    <CardItem button onPress={onPress}>
      <Col style={style.titleColumn}>
        <Text style={style.title}>
          {`${title}  `}
          <ChevronIcon direction={direction} />
        </Text>
      </Col>
    </CardItem>
  );
}

AccordionHeader.propTypes = {
  title: PropTypes.string,
  direction: PropTypes.string,
  onPress: PropTypes.func,
};

AccordionHeader.defaultProps = {
  title: 'Horários',
  direction: 'up',
  onPress: null,
};

const style = EStyleSheet.create({
  titleColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: rem(16),
    fontFamily: 'OpenSans_regular',
  },
});
