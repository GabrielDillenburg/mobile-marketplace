import React from 'react';
import { View, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../../constants/Colors';
import rem from '../../utils/rem';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Ionicons } from '@expo/vector-icons';

const StandardToast = ({ type, message }) => {
  const selectType = () => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'failure':
        return Colors.danger;
      case 'warning':
        return Colors.yellow1;
    }
  };

  return (
    <View
      style={{
        backgroundColor: selectType(),
        ...styles.container,
      }}
    >
      <View style={styles.content}>
        <Text style={styles.text}>{message}</Text>
        <Ionicons
          name="close"
          size={rem(15)}
          color="white"
          onPress={() => Toast.hide()}
        />
      </View>
    </View>
  );
};

const toastConfig = {
  success: ({ text1 }) => <StandardToast type="success" message={text1} />,
  failure: ({ text1 }) => <StandardToast type="failure" message={text1} />,
  warning: ({ text1 }) => <StandardToast type="warning" message={text1} />,
};

const ToastMessage = () => {
  return (
    <>
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

export default ToastMessage;

const styles = EStyleSheet.create({
  container: {
    width: '82%',
    paddingVertical: rem(25),
    paddingLeft: rem(25),
    paddingRight: rem(49),
    borderRadius: rem(5),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  text: {
    fontFamily: 'OpenSans_semibold',
    fontSize: rem(16),
    lineHeight: rem(20),
    color: '#fff',
    paddingRight: rem(8),
  },
});
