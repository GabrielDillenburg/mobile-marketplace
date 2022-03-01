/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'native-base';
import rem from '../../utils/rem';

import Colors from '../../constants/Colors';

const NBButton = (props) => {
  const {
    children,
    backgroundColor,
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    loading,
    disabled,
  } = props;

  return (
    <Button
      {...props}
      style={[
        {
          borderRadius,
          borderTopLeftRadius,
          borderTopRightRadius,
        },
        disabled ? { backgroundColor: Colors.grey4 } : { backgroundColor },
      ]}
    >
      {loading ? <ActivityIndicator color="white" /> : children}
    </Button>
  );
};

NBButton.defaultProps = {
  backgroundColor: Colors.blue1,
  borderRadius: rem(10),
  borderTopLeftRadius: rem(10),
  borderTopRightRadius: rem(10),
  loading: false,
};

NBButton.propTypes = {
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.number,
  borderTopLeftRadius: PropTypes.number,
  borderTopRightRadius: PropTypes.number,
  loading: PropTypes.bool,
};

export default NBButton;
