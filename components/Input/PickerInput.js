import { Icon, Item, Picker, Text } from 'native-base';
import PropTypes from 'prop-types';
import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import rem from '../../utils/rem';
import Colors from '../../constants/Colors';

/**
 * @typedef Props
 * @property {string} placeholder
 * @property {string} iconName
 * @property {string} initialLabel
 * @property {string} label
 * @property {number} value
 * @property {Function} changeFunction
 * @property {string} formRefer
 * @property {boolean} usingFormik Altera a função de onValueChange
 * @property {{label:string, value:number|string}[]} items
 */
/**
 * @type {React.FC<Props>}
 * @property { string } placeholder
 * @property {string} iconName - Referência do ícone do pacote native base
 * @property {string} initialLabel - Label do item inicial do dropdown
 * @property {string} label -
 * @property {number} value - Valor de referência para input selecionado
 * @property {Function} changeFunction - useState ou setFieldForm ( Formik )
 * @property {string} formRefer - Referência da varíavel do Formik
 * @property {boolean} usingFormik - Boolean to define Formik ou useState
 * @property {{label:string, value: number|string}[]} items - Array de Objetos para inserção de items no Picker
 */
const PickerInput = (props) => {
  const {
    placeholder,
    iconName,
    initialLabel,
    label,
    value,
    changeFunction,
    formRefer,
    usingFormik,
    items,
    error,
  } = props;

  const active = value !== '';

  return (
    <Item style={style.item}>
      {active && <Text style={style.labelActive}> {label} </Text>}
      <Picker
        mode="dropdown"
        iosIcon={<Icon name={iconName} />}
        placeholder={placeholder}
        placeholderStyle={{ color: Colors.gray1 }}
        textStyle={Colors.grey1}
        itemStyle={{
          backgroundColor: Colors.grey8,
        }}
        itemTextStyle={{
          color: Colors.text,
          fontFamily: 'OpenSans_regular',
        }}
        style={style.picker}
        selectedValue={value}
        onValueChange={(val) =>
          usingFormik ? changeFunction(formRefer, val) : changeFunction(val)
        }
      >
        <Picker.Item key={0} label={initialLabel} value="" />
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
      {error && <Text style={style.errorMessage}>{error}</Text>}
    </Item>
  );
};

export default PickerInput;

PickerInput.propTypes = {
  placeholder: PropTypes.string,
  initialLabel: PropTypes.string,
  iconName: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeFunction: PropTypes.func.isRequired,
  formRefer: PropTypes.string,
  usingFormik: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

PickerInput.defaultProps = {
  placeholder: 'Selecione um item',
  initialLabel: 'Selecione um item',
  iconName: 'arrow-down',
  label: 'label',
  value: null,
  formRefer: null,
  usingFormik: false,
};

const style = EStyleSheet.create({
  labelActive: {
    position: 'absolute',
    top: 0,
    left: 0,
    color: Colors.label,
    fontSize: 12,
    fontFamily: 'OpenSans_regular',
  },
  item: {
    marginTop: rem(20),
    borderBottomColor: Colors.black1,
    borderBottomWidth: rem(1),
  },
  picker: {
    height: rem(30),
    width: '100%',
    marginTop: rem(20),
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
