import React from 'react';
import PropTypes from 'prop-types';
import { Item, Text, Spinner, View } from 'native-base';
import { TextInput } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TextInputMask } from 'react-native-masked-text';

import rem from '../../utils/rem';
import Colors from '../../constants/Colors';

/**
 * @typedef Props
 * @property {string} label
 * @property {string} value
 * @property {string} error
 * @property {string} label
 * @property {object} innerRef
 * @property {string} labelLength
 * @property {number} maxLength
 * @property {boolean} disabled
 * @property {boolean} loading
 * @property {func} onBlur
 * @property {string} maskInput
 */
/**
 * @type {React.FC<Props>}
 * @property {string} label
 * @property {string} value
 * @property {string} error
 * @property {string} label
 * @property {object} innerRef
 * @property {string} labelLength
 * @property {number} maxLength
 * @property {boolean} disabled
 * @property {boolean} loading
 * @property {func} onBlur
 * @property {string} maskInput
 */
const FloatedLabelInput = (props) => {
  const [isFocused, setFocus] = React.useState(false);
  const {
    label,
    value,
    error,
    disabled,
    innerRef,
    maxLength,
    loading,
    onBlur,
    maskInput,
  } = props;
  const Active = value?.length > 0;

  const hasValueLength = value?.length || value?.length != null;

  const labelStyle = styledLabel(disabled, error, isFocused, Active);
  const lengthStyle = styledLength(error, isFocused, Active);

  const itemStyle = styledItem(disabled, error, isFocused);
  return (
    <Item style={itemStyle}>
      <Text style={labelStyle}>{label}</Text>
      {maxLength && (
        <Text style={lengthStyle}>
          {hasValueLength ? value?.length : '0'}/{maxLength}
        </Text>
      )}
      {maskInput ? (
        <TextInputMask
          style={style.input}
          editable={!disabled}
          type={maskInput}
          {...props}
          onFocus={() => setFocus(!isFocused)}
          onBlur={(e) => {
            onBlur(e);
            setFocus(!isFocused);
          }}
          ref={innerRef}
        />
      ) : (
        <TextInput
          style={style.input}
          editable={!disabled}
          {...props}
          onFocus={() => setFocus(!isFocused)}
          onBlur={(e) => {
            onBlur(e);
            setFocus(!isFocused);
          }}
          ref={innerRef}
        />
      )}

      {loading && (
        <View style={style.spinner}>
          <Spinner color={Colors.grey7} />
        </View>
      )}

      {error && !isFocused && <Text style={style.errorMessage}>{error}</Text>}
    </Item>
  );
};

FloatedLabelInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  innerRef: PropTypes.instanceOf(Object),
  loading: PropTypes.bool,
  onBlur: PropTypes.func,
  maskInput: PropTypes.string,
};

FloatedLabelInput.defaultProps = {
  label: 'Label',
  value: '',
  error: null,
  disabled: false,
  maxLength: null,
  innerRef: null,
  loading: false,
  onBlur: () => '',
  maskInput: '',
};

export default FloatedLabelInput;

const style = EStyleSheet.create({
  labelFocused: {
    position: 'absolute',
    left: 0,
    top: 0,
    fontSize: rem(12),
    color: Colors.blue1,
    fontFamily: 'OpenSans_regular',
  },
  labelInactive: {
    position: 'absolute',
    left: 0,
    top: rem(20),
    fontSize: rem(16),
    color: Colors.grey2,
    fontFamily: 'OpenSans_regular',
  },
  labelActive: {
    position: 'absolute',
    left: 0,
    top: 0,
    fontSize: rem(12),
    color: Colors.label,
    fontFamily: 'OpenSans_regular',
  },
  labelInvalid: {
    position: 'absolute',
    left: 0,
    top: 0,
    fontSize: rem(12),
    color: Colors.danger,
    fontFamily: 'OpenSans_regular',
  },
  labelDisabled: {
    position: 'absolute',
    left: 0,
    top: rem(20),
    fontSize: rem(16),
    color: Colors.grey6,
    fontFamily: 'OpenSans_regular',
  },
  input: {
    fontSize: rem(16),
    lineHeight: rem(24),
    marginTop: rem(15),
    width: '100%',
    height: rem(40),
    color: Colors.grey1,
    fontFamily: 'OpenSans_regular',
  },
  spinner: {
    position: 'absolute',
    right: 0,
  },
  length: {
    color: Colors.grey1,
    fontSize: rem(16),
    position: 'absolute',
    right: 0,
    top: rem(20),
    fontFamily: 'OpenSans_regular',
  },
  lengthActive: {
    color: Colors.grey1,
    fontSize: rem(14),
    top: 0,
    right: 0,
    position: 'absolute',
    fontFamily: 'OpenSans_regular',
  },
  itemDefault: {
    marginTop: rem(20),
    borderBottomWidth: rem(1),
    borderBottomColor: '#000',
  },
  itemInvalid: {
    marginTop: rem(20),
    borderBottomWidth: rem(1),
    borderBottomColor: Colors.danger,
  },
  itemFocused: {
    marginTop: rem(20),
    borderBottomWidth: rem(1),
    borderBottomColor: Colors.blue1,
  },
  itemDisabled: {
    marginTop: rem(20),
    borderBottomWidth: rem(1),
    borderBottomColor: Colors.grey6,
  },
  errorMessage: {
    color: Colors.danger,
    position: 'absolute',
    fontSize: rem(12),
    left: 0,
    top: rem(60),
    fontFamily: 'OpenSans_regular',
  },
});

function styledLabel(disabled, isInvalid, isFocused, Active) {
  if (disabled) return style.labelDisabled;
  if (isFocused) return style.labelFocused;
  if (isInvalid) return style.labelInvalid;
  if (Active) return style.labelActive;
  return style.labelInactive;
}

function styledLength(isInvalid, isFocused, Active) {
  if (isFocused || isInvalid || Active) return style.lengthActive;
  return style.length;
}

function styledItem(disabled, isInvalid, isFocused) {
  if (disabled) return style.itemDisabled;
  if (isFocused) return style.itemFocused;
  if (isInvalid) return style.itemInvalid;
  return style.itemDefault;
}
