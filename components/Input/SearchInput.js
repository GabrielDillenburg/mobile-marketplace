import React from 'react';
import PropTypes from 'prop-types';
import { Input, Item, Icon } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import rem from '../../utils/rem';

const NBSearchInput = (props) => {
  const { borderRadius, backgroundColor, leftIconName, RightIconName } = props;

  return (
    <Item style={(style.inputItem, { borderRadius, backgroundColor })} regular>
      {leftIconName != null && (
        <Icon name={leftIconName} style={style.iconColor} />
      )}
      <Input style={style.input} placeholderTextColor="#65696B" {...props} />
      {RightIconName != null && (
        <Icon name={RightIconName} style={style.iconColor} />
      )}
    </Item>
  );
};

const style = EStyleSheet.create({
  iconColor: {
    color: '#65696B',
  },
  inputItem: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: rem(1),
    },
    shadowOpacity: 0.22,
    shadowRadius: rem(2.22),
    elevation: 3,
  },
  input: {
    fontFamily: 'OpenSans_regular',
    color: '#65696B',
  },
});

NBSearchInput.defaultProps = {
  borderRadius: rem(5),
};

NBSearchInput.propTypes = {
  borderRadius: PropTypes.number,
  backgroundColor: PropTypes.string,
  leftIconName: PropTypes.string,
  RightIconName: PropTypes.string,
};

export default NBSearchInput;
