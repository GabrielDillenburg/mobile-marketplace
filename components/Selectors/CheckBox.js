/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Icon } from 'native-base';
import { View, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

import Text from '../Text/Text';

import rem from '../../utils/rem';

const CheckBox = (props) => {
  const { onCheck, value, label, size, fontSize } = props;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(value);
  }, [value]);

  return (
    <TouchableOpacity style={style.container} onPress={onCheck}>
      <View
        style={{
          ...style.check,
          borderColor: checked ? '#00A3F4' : '#B3B9BB',
          backgroundColor: checked ? '#00A3F4' : '#ffffff',
          width: rem(size),
          height: rem(size),
        }}
      >
        {checked ? (
          <Icon
            type="MaterialIcons"
            name="check"
            style={{
              fontSize: rem(size - 4),
              color: '#fff',
            }}
          />
        ) : null}
      </View>
      <Text style={style.label} fontSize={rem(fontSize)}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

CheckBox.propTypes = {
  onCheck: PropTypes.func,
  value: PropTypes.bool,
  label: PropTypes.string,
  size: PropTypes.number,
  fontSize: PropTypes.number,
};

CheckBox.defaultProps = {
  onCheck: () => {},
  value: false,
  label: '',
  size: 20,
  fontSize: 14,
};

const style = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  check: {
    borderWidth: rem(2),
    borderRadius: rem(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginLeft: rem(10),
  },
});

export default CheckBox;
