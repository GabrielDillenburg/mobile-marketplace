import React, { useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View } from 'react-native';
import Colors from '../../constants/Colors';
import rem from '../../utils/rem';
import { Picker } from '@react-native-picker/picker';

const DropDown = ({ options }) => {
  const [selected, setSelected] = useState();
  return (
    <View style={styles.container}>
      <Picker
        style={styles.picker}
        selectedValue={selected}
        onValueChange={(itemValue) => setSelected(itemValue)}
      >
        {options.map((option) => (
          <Picker.Item
            value={option.value}
            label={option.label}
            key={option.value}
            color={Colors.black4}
            fontFamily="OpenSans_regular"
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    borderColor: Colors.grey7,
    borderWidth: rem(1),
    borderRadius: rem(4),
  },

  picker: {
    minHeight: rem(55),
  },
});

export default DropDown;
