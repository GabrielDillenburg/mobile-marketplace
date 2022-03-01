/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import Colors from '../../constants/Colors';
import rem from '../../utils/rem';

const NBText = (props) => {
  const {
    children,
    color,
    fontSize,
    fontWeight,
    textAlign,
    textTransform,
    style,
  } = props;

  const remFontSize = rem(fontSize);

  return (
    <Text
      {...props}
      style={{
        fontSize: remFontSize,
        fontFamily: `OpenSans_${fontWeight}`,
        lineHeight: remFontSize * 1.2,
        textAlign,
        textTransform,
        color,
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

NBText.defaultProps = {
  color: Colors.black3,
  fontSize: 16,
  children: '',
  fontWeight: 'regular',
  textAlign: 'left',
  textTransform: 'none',
  style: {},
};

NBText.propTypes = {
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  fontWeight: PropTypes.oneOf(['light', 'regular', 'semibold', 'bold']),
  fontSize: PropTypes.number,
  textAlign: PropTypes.oneOf(['center', 'left', 'right']),
  textTransform: PropTypes.oneOf([
    'none',
    'uppercase',
    'lowercase',
    'capitalize',
  ]),
};

export default NBText;
