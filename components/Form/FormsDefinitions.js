/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import * as Yup from 'yup';
import { Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Icon, Text, View } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/core';

import rem from '../../utils/rem';
import FloatedLabelInput from '../Input/FloatedInput';
import Colors from '../../constants/Colors';
import { ValidationRules } from '../../constants/Validation';
import Avatar from '../Avatar/Avatar';
import CheckBox from '../Selectors/CheckBox';

const { width } = Dimensions.get('window');

const studentInitialValues = Object.freeze({
  name: '',
  lastName: '',
  cpf: '',
  noCpf: false,
  birthdate: '',
  phone: '',
  email: '',
});

const studentValidationSchema = Yup.object().shape({
  name: ValidationRules.string,
  lastName: ValidationRules.string,
  noCpf: Yup.boolean(),

  cpf: Yup.string().when('noCpf', {
    is: false,
    then: ValidationRules.cpf,
  }),
  birthdate: ValidationRules.birthdate,
  phone: ValidationRules.phone,
  email: ValidationRules.email,
});

const AvatarEdit = ({ source, onPress }) => (
  <View style={style.pictureArea}>
    <Text style={style.pictureLabel}>Foto do perfil</Text>
    <TouchableOpacity style={style.pictureArea} onPress={onPress}>
      <Avatar
        source={source}
        size={90}
        style={{
          margin: rem(15),
        }}
      />

      <View style={style.editArea}>
        <Icon type="MaterialIcons" name="edit" style={style.editIcon} />
      </View>
    </TouchableOpacity>
  </View>
);

const StudentFields = ({
  setFieldTouched,
  setFieldValue,
  handleChange,
  handleBlur,
  touched,
  values,
  errors,
  editing,
}) => {
  const lastNameInput = useRef();
  const cpfInput = useRef();
  const birthdateInput = useRef();
  const phoneInput = useRef();
  const emailInput = useRef();

  return (
    <>
      <View style={style.inputWrapper}>
        <FloatedLabelInput
          value={values.name}
          label="Nome"
          onChangeText={handleChange('name')}
          onBlur={() => {
            handleBlur('name');
            setFieldTouched('name', true);
          }}
          error={errors.name && touched.name ? errors.name : null}
          returnKeyType="next"
          onSubmitEditing={() => lastNameInput.current.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={style.inputWrapper}>
        <FloatedLabelInput
          value={values.lastName}
          label="Sobrenome"
          onChangeText={handleChange('lastName')}
          onBlur={() => {
            handleBlur('lastName');
            setFieldTouched('lastName', true);
          }}
          error={errors.lastName && touched.lastName ? errors.lastName : null}
          returnKeyType="next"
          innerRef={lastNameInput}
          onSubmitEditing={() =>
            values.noCpf
              ? birthdateInput.current._inputElement.focus()
              : cpfInput.current._inputElement.focus()
          }
          blurOnSubmit={false}
        />
      </View>

      {editing ? null : (
        <>
          <View style={style.inputWrapper}>
            <FloatedLabelInput
              value={values.cpf}
              label="CPF"
              disabled={values.noCpf}
              onChangeText={handleChange('cpf')}
              onBlur={() => {
                handleBlur('cpf');
                setFieldTouched('cpf', true);
              }}
              error={errors.cpf && touched.cpf ? errors.cpf : null}
              returnKeyType="next"
              innerRef={cpfInput}
              onSubmitEditing={() =>
                birthdateInput.current._inputElement.focus()
              }
              blurOnSubmit={false}
              keyboardType="numeric"
              maskInput="cpf"
            />
          </View>
          <View style={style.checkboxArea}>
            <CheckBox
              label="Não possuo CPF"
              value={values.noCpf}
              onCheck={() => {
                setFieldValue('cpf', '');
                setFieldValue('noCpf', !values.noCpf);
              }}
            />
          </View>
        </>
      )}

      <View style={style.inputWrapper}>
        <FloatedLabelInput
          value={values.birthdate}
          label="Data de nascimento"
          onChangeText={handleChange('birthdate')}
          onBlur={() => {
            handleBlur('birthdate');
            setFieldTouched('birthdate', true);
          }}
          error={
            errors.birthdate && touched.birthdate ? errors.birthdate : null
          }
          returnKeyType="next"
          innerRef={birthdateInput}
          onSubmitEditing={() => phoneInput.current._inputElement.focus()}
          blurOnSubmit={false}
          keyboardType="numeric"
          maskInput="datetime"
          options={{
            format: 'DD/MM/YYYY',
          }}
        />
      </View>

      <View style={style.inputWrapper}>
        <FloatedLabelInput
          value={values.phone}
          label="Celular"
          onChangeText={handleChange('phone')}
          onBlur={() => {
            handleBlur('phone');
            setFieldTouched('phone', true);
          }}
          error={errors.phone && touched.phone ? errors.phone : null}
          returnKeyType={editing ? 'done' : 'next'}
          innerRef={phoneInput}
          onSubmitEditing={() => (editing ? null : emailInput.current.focus())}
          blurOnSubmit={editing}
          keyboardType="numeric"
          maskInput="cel-phone"
          options={{
            maskType: 'BRL',
            withDDD: true,
            dddMask: '(99) ',
          }}
        />
      </View>

      {editing ? null : (
        <View style={style.inputWrapper}>
          <FloatedLabelInput
            value={values.email}
            label="E-mail"
            onChangeText={(text) => {
              setFieldValue('email', text.toLowerCase());
            }}
            onBlur={() => {
              handleBlur('email');
              setFieldTouched('email', true);
            }}
            error={errors.email && touched.email ? errors.email : null}
            innerRef={emailInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      )}
    </>
  );
};

const guardianInitialValues = Object.freeze({
  guardianName: '',
  guardianLastName: '',
  guardianRelationship: '',
  guardianCpf: '',
  guardianPhone: '',
  guardianEmail: '',
});

const guardianValidationSchema = Yup.object().shape({
  guardianName: ValidationRules.string,
  guardianLastName: ValidationRules.string,
  guardianCpf: ValidationRules.cpf,
  guardianPhone: ValidationRules.phone,
  guardianEmail: ValidationRules.email,
  guardianRelationship: ValidationRules.string,
});

const GuardianFields = ({
  handleChange,
  handleBlur,
  setFieldTouched,
  setFieldValue,
  touched,
  values,
  errors,
  // editing,
}) => {
  const guardianLastNameInput = useRef();
  const guardianRelationshipInput = useRef();
  const guardianCpfInput = useRef();
  const guardianPhoneInput = useRef();
  const guardianEmailInput = useRef();

  return (
    <>
      <View style={style.inputWrapper}>
        <FloatedLabelInput
          value={values.guardianName}
          label="Nome do responsável"
          onChangeText={handleChange('guardianName')}
          onBlur={() => {
            handleBlur('guardianName');
            setFieldTouched('guardianName', true);
          }}
          error={
            errors.guardianName && touched.guardianName
              ? errors.guardianName
              : null
          }
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => guardianLastNameInput.current.focus()}
        />
      </View>
      <View style={style.inputWrapper}>
        <FloatedLabelInput
          value={values.guardianLastName}
          label="Sobrenome do responsável"
          onChangeText={handleChange('guardianLastName')}
          onBlur={() => {
            handleBlur('guardianLastName');
            setFieldTouched('guardianLastName', true);
          }}
          error={
            errors.guardianLastName && touched.guardianLastName
              ? errors.guardianLastName
              : null
          }
          returnKeyType="next"
          blurOnSubmit={false}
          innerRef={guardianLastNameInput}
          onSubmitEditing={() => guardianRelationshipInput.current.focus()}
        />
      </View>
      <View style={style.inputWrapper}>
        <FloatedLabelInput
          value={values.guardianRelationship}
          label="Grau de parentesco"
          onChangeText={handleChange('guardianRelationship')}
          onBlur={() => {
            handleBlur('guardianRelationship');
            setFieldTouched('guardianRelationship', true);
          }}
          error={
            errors.guardianRelationship && touched.guardianRelationship
              ? errors.guardianRelationship
              : null
          }
          returnKeyType="next"
          blurOnSubmit={false}
          innerRef={guardianRelationshipInput}
          onSubmitEditing={() => guardianCpfInput.current._inputElement.focus()}
        />
      </View>
      <View style={style.inputWrapper}>
        <FloatedLabelInput
          value={values.guardianCpf}
          label="CPF"
          onChangeText={handleChange('guardianCpf')}
          onBlur={() => {
            handleBlur('guardianCpf');
            setFieldTouched('guardianCpf', true);
          }}
          error={
            errors.guardianCpf && touched.guardianCpf
              ? errors.guardianCpf
              : null
          }
          returnKeyType="next"
          blurOnSubmit={false}
          innerRef={guardianCpfInput}
          onSubmitEditing={() =>
            guardianPhoneInput.current._inputElement.focus()
          }
          keyboardType="numeric"
          maskInput="cpf"
        />
      </View>
      <View style={style.inputWrapper}>
        <FloatedLabelInput
          value={values.guardianPhone}
          label="Celular"
          onChangeText={handleChange('guardianPhone')}
          onBlur={() => {
            handleBlur('guardianPhone');
            setFieldTouched('guardianPhone', true);
          }}
          error={
            errors.guardianPhone && touched.guardianPhone
              ? errors.guardianPhone
              : null
          }
          returnKeyType="next"
          blurOnSubmit={false}
          innerRef={guardianPhoneInput}
          onSubmitEditing={() => guardianEmailInput.current.focus()}
          keyboardType="numeric"
          maskInput="cel-phone"
          options={{
            maskType: 'BRL',
            withDDD: true,
            dddMask: '(99) ',
          }}
        />
      </View>
      <View style={style.inputWrapper}>
        <FloatedLabelInput
          value={values.guardianEmail}
          label="E-mail"
          onChangeText={(text) => {
            setFieldValue('guardianEmail', text.toLowerCase());
          }}
          onBlur={() => {
            handleBlur('guardianEmail');
            setFieldTouched('guardianEmail', true);
          }}
          error={
            errors.guardianEmail && touched.guardianEmail
              ? errors.guardianEmail
              : null
          }
          autoCapitalize="none"
          keyboardType="email-address"
          innerRef={guardianEmailInput}
        />
      </View>
    </>
  );
};

const Buttons = ({ handleSubmit, isValid, isSubmitting = false }) => {
  const navigation = useNavigation();

  // const [valid, setValid] = useState(false);

  // useEffect(() => {
  //   setValid(isValid);
  // }, [isValid]);

  // useEffect(() => {
  //   setValid(false);
  // }, []);

  return (
    <View style={style.buttonGroup}>
      <Button
        style={[style.button, style.buttonPrevious]}
        onPress={() => navigation.goBack()}
        disabled={isSubmitting}
      >
        <Text style={style.textButtonPrevious} uppercase={false}>
          Voltar
        </Text>
      </Button>
      <Button
        style={[
          style.button,
          isValid ? style.buttonNext : style.buttonNextDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text
            uppercase={false}
            style={
              isValid ? style.textButtonNext : style.textButtonNextDisabled
            }
          >
            Avançar
          </Text>
        )}
      </Button>
    </View>
  );
};

const style = EStyleSheet.create({
  inner: {
    padding: rem(30),
    backgroundColor: 'white',
    justifyContent: 'space-around',
  },

  pictureArea: {
    alignItems: 'center',
  },

  pictureLabel: {
    fontSize: rem(12),
    color: Colors.label,
    fontFamily: 'OpenSans_regular',
  },

  editArea: {
    padding: rem(30),
    right: rem(-30),
    marginTop: rem(-67),
  },

  editIcon: {
    fontSize: rem(10),
    color: '#65696B',
    padding: rem(6),
    borderRadius: rem(50),
    shadowOpacity: rem(0.14),
    borderWidth: rem(0.2),
    backgroundColor: Colors.white,
    fontFamily: 'OpenSans_regular',
  },

  header: {
    color: Colors.grey1,
    fontSize: rem(18),
    fontFamily: 'OpenSans_semibold',
  },

  checkboxArea: {
    marginTop: rem(10),
  },

  separator: {
    height: rem(10),
    backgroundColor: Colors.grey9,
  },

  buttonGroup: {
    marginTop: rem(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: (width - rem(90)) / 2,
    justifyContent: 'center',
  },

  buttonNext: {
    backgroundColor: Colors.blue1,
  },

  buttonNextDisabled: {
    backgroundColor: Colors.grey4,
  },

  buttonPrevious: {
    backgroundColor: 'white',
    borderColor: Colors.blue1,
    borderWidth: 1,
  },

  textButtonNext: {
    color: Colors.white,
    fontFamily: 'OpenSans_bold',
  },

  textButtonNextDisabled: {
    color: Colors.white,
    fontFamily: 'OpenSans_bold',
  },

  textButtonPrevious: {
    color: Colors.blue1,
    fontFamily: 'OpenSans_regular',
  },

  inputWrapper: {
    marginBottom: rem(16),
  },
});

export {
  studentInitialValues,
  studentValidationSchema,
  AvatarEdit,
  StudentFields,
  guardianInitialValues,
  guardianValidationSchema,
  GuardianFields,
  Buttons,
  style,
};
