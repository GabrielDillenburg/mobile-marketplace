import React, { useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View, Switch, Text } from 'react-native';
import Colors from '../../constants/Colors';
import rem from '../../utils/rem';

const Toggle = ({ checkedText, uncheckedText }) => {
  const [status, setStatus] = useState(false);

  const handleToggle = () => setStatus((current) => !current);

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: status ? Colors.blue1 : Colors.grey13,
          width: rem(47),
          borderRadius: rem(20),
        }}
      >
        <Switch
          value={status}
          onValueChange={handleToggle}
          trackColor={{
            true: Colors.blue1,
            false: Colors.grey13,
          }}
          thumbColor="#fff"
        />
      </View>
      <Text style={styles.text}>{status ? checkedText : uncheckedText}</Text>
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  text: {
    fontFamily: 'OpenSans_regular',
    fontSize: rem(16),
    lineHeight: rem(22.4),
    marginLeft: rem(16),
    color: Colors.black3,
  },
});

export default Toggle;
