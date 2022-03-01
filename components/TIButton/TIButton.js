import React from 'react';
import Colors from '../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import rem from '../../utils/rem';

const TIButton = (props) => {
  const primaryColor = Colors.blue1;
  const secondaryColor = Colors.purple1;

  const {
    children,
    disabled,
    type,
    variant,
    buttonColor,
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    paddingHorizontal,
    paddingVertical,
    marginHorizontal,
    marginVertical,
    width,
    height,
  } = props;

  const setColor = () => {
    if (disabled) return Colors.grey6;
    if (type === 'primary' && !buttonColor) return primaryColor;
    return type === 'secondary' && !buttonColor ? secondaryColor : buttonColor;
  };

  const setVariant = () => {
    if (variant === 'filled' || disabled) {
      return {
        backgroundColor: setColor(),
      };
    }
    return {
      backgroundColor: 'transparent',
      borderColor: setColor(),
      borderWidth: rem(1),
    };
  };

  return (
    <TouchableOpacity
      {...props}
      style={{
        ...setVariant(),
        borderRadius,
        borderTopLeftRadius,
        borderTopRightRadius,
        paddingHorizontal,
        paddingVertical,
        marginHorizontal,
        marginVertical,
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </TouchableOpacity>
  );
};

TIButton.defaultProps = {
  type: 'primary',
  variant: 'filled',
  disabled: false,
};

TIButton.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary']),
  variant: PropTypes.oneOf(['filled', 'outlined']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  buttonColor: PropTypes.string,
  borderRadius: PropTypes.number,
  borderTopLeftRadius: PropTypes.number,
  borderTopRightRadius: PropTypes.number,
  paddingHorizontal: PropTypes.number,
  paddingVertical: PropTypes.number,
  marginHorizontal: PropTypes.number,
  marginVertical: PropTypes.number,
};

export default TIButton;
