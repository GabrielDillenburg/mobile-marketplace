import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Colors from '../../constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import rem from '../../utils/rem';

const Radio = ({
  options,
  direction,
  showLabel = true,
  labelDirection,
  spacing,
}) => {
  const [checked, setChecked] = useState(options[0].value);

  const setDirection = (value) => {
    return value !== 'row' && value !== 'column' ? 'row' : value;
  };

  const setMargin = (radioDirection) => {
    if (!radioDirection) radioDirection = 'row';
    return radioDirection === 'row'
      ? { marginRight: spacing ? rem(spacing) : 0 }
      : { marginBottom: spacing ? rem(spacing) : 0 };
  };

  const setAlign = () => {
    return direction === 'column' && labelDirection === 'column'
      ? null
      : { alignItems: 'center' };
  };

  return (
    <View style={{ flexDirection: setDirection(direction) }}>
      {options.map((option) => (
        <View
          style={{
            flexDirection: setDirection(labelDirection),
            ...setMargin(direction),
            ...setAlign(),
          }}
          key={option.value + options.indexOf(option.value)}
        >
          <RadioButton
            value={option.value}
            status={checked === option.value ? 'checked' : 'unchecked'}
            onPress={() => setChecked(option.value)}
            uncheckedColor={Colors.grey6}
            color={Colors.blue1}
          />
          <Text style={styles.text}>{showLabel ? option.label : null}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = EStyleSheet.create({
  text: {
    fontFamily: 'OpenSans_regular',
    fontSize: rem(16),
    lineHeight: rem(24),
    color: Colors.black3,
  },
});

export default Radio;
