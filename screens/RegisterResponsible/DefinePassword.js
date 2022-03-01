/* eslint-disable no-console */
import React, { useState, useRef } from 'react';
import { Pressable } from 'react-native';
import { flowResult } from 'mobx';
import { Observer, observer } from 'mobx-react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Button, Text, View } from 'native-base';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

import { useStore } from '../../hooks/useStore';

import FloatedLabelInput from '../../components/Input/FloatedInput';
import CheckBox from '../../components/Selectors/CheckBox';

import Colors from '../../constants/Colors';
import Validations from '../../constants/Validation';
import rem from '../../utils/rem';
import openUrl from '../../utils/openUrl';

const initialValues = {
  password: '',
  confirmPassword: '',
};

const validationSchema = Yup.object().shape({
  password: Yup.string().min(8, Validations.min).required(Validations.required),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], Validations.passwordConfirm)
    .required(Validations.required),
});

const DefinePassword = () => {
  const store = useStore();
  const confirmPasswordInput = useRef();
  const navigation = useNavigation();
  const [useTerms, setUseTerms] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const onSubmit = async ({ password, confirmPassword }) => {
    try {
      const payload = {
        ...store.studentStore.studentRegisterData,
        password,
        password_confirmation: confirmPassword,
        term_of_use: useTerms ? 1 : 0,
        term_of_responsibility: privacyPolicy ? 1 : 0,
      };

      await store.studentStore.setStudentRegisterData(payload);

      const resgisterRes = await flowResult(store.studentStore.register());

      if (resgisterRes) {
        Toast.show({
          type: 'success',
          text1: 'Usuário cadastrado com sucesso!',
        });

        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPressHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <View style={style.screen}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({
          setFieldTouched,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          values,
          errors,
          isValid,
          isSubmitting,
        }) => {
          const enableButton =
            isValid &&
            !!values.password.length &&
            !!values.confirmPassword.length &&
            useTerms &&
            privacyPolicy;

          return (
            <Observer>
              {() => (
                <View style={style.inner}>
                  <Text style={style.header}>Crie uma senha</Text>
                  <View style={style.inputWrapper}>
                    <FloatedLabelInput
                      value={values.password}
                      secureTextEntry={hidePassword}
                      label="Senha"
                      onChangeText={handleChange('password')}
                      onBlur={() => {
                        handleBlur('password');
                        setFieldTouched('password', true);
                      }}
                      error={
                        errors.password && touched.password
                          ? errors.password
                          : null
                      }
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        confirmPasswordInput.current.focus()
                      }
                      blurOnSubmit={false}
                    />
                    <Ionicons
                      style={style.password}
                      name={hidePassword ? 'eye-off' : 'eye'}
                      size={rem(24)}
                      onPress={onPressHidePassword}
                    />
                  </View>

                  <View style={style.inputWrapper}>
                    <FloatedLabelInput
                      value={values.confirmPassword}
                      autoCapitalize="none"
                      label="Confirmar senha"
                      secureTextEntry={hidePassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={() => {
                        handleBlur('confirmPassword');
                        setFieldTouched('confirmPassword', true);
                      }}
                      error={
                        errors.confirmPassword && touched.confirmPassword
                          ? errors.confirmPassword
                          : null
                      }
                      innerRef={confirmPasswordInput}
                    />
                    <Ionicons
                      style={style.password}
                      name={hidePassword ? 'eye-off' : 'eye'}
                      size={rem(24)}
                      onPress={onPressHidePassword}
                    />
                  </View>

                  <View style={style.politics}>
                    <View style={style.checkboxWrapper}>
                      <CheckBox
                        value={useTerms}
                        onCheck={() => setUseTerms(!useTerms)}
                      />
                      <View style={style.checkboxText}>
                        <Text style={style.text} fontSize={rem(14)}>
                          Li e aceito os
                        </Text>
                        <Pressable
                          onPress={() => {
                            openUrl(
                              'https://edtech.com.br/termos-de-uso-da-plataforma/',
                            );
                          }}
                        >
                          <Text
                            style={style.checkboxTextLink}
                            fontSize={rem(14)}
                          >
                            Termos de Uso.
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={style.checkboxWrapper}>
                      <CheckBox
                        value={privacyPolicy}
                        onCheck={() => setPrivacyPolicy(!privacyPolicy)}
                      />
                      <View style={style.checkboxText}>
                        <Text style={style.text} fontSize={rem(14)}>
                          Li e aceito as
                        </Text>
                        <Pressable
                          onPress={() => {
                            openUrl(
                              'https://edtech.com.br/politica-privacidade/',
                            );
                          }}
                        >
                          <Text
                            style={style.checkboxTextLink}
                            fontSize={rem(14)}
                          >
                            Políticas de Privacidade.
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                  <Button
                    style={
                      enableButton ? style.formButton : style.formButtonDisabled
                    }
                    onPress={handleSubmit}
                    disabled={!enableButton}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={style.textButton}>Criar conta</Text>
                    )}
                  </Button>
                </View>
              )}
            </Observer>
          );
        }}
      </Formik>
    </View>
  );
};

const style = EStyleSheet.create({
  screen: {
    backgroundColor: 'white',
    flex: 1,
  },
  text: {
    fontFamily: 'OpenSans_regular',
  },
  header: {
    marginTop: rem(30),
    marginBottom: rem(10),
    fontSize: rem(18),
    fontFamily: 'OpenSans_bold',
  },
  inner: {
    paddingHorizontal: rem(20),
  },
  inputWrapper: {
    marginBottom: rem(16),
  },
  password: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    color: '#545859',
  },
  formButton: {
    marginTop: rem(70),
    borderRadius: rem(10),
    width: '100%',
    backgroundColor: Colors.blue1,
    justifyContent: 'center',
  },
  formButtonDisabled: {
    marginTop: rem(70),
    borderRadius: rem(10),
    width: '100%',
    backgroundColor: '#aaa',
    justifyContent: 'center',
  },
  textButton: {
    fontFamily: 'OpenSans_bold',
    color: Colors.white,
  },
  politics: {
    marginTop: rem(40),
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: rem(10),
  },
  checkboxText: {
    flexDirection: 'row',
  },
  checkboxTextLink: {
    fontFamily: 'OpenSans_bold',
    marginLeft: rem(5),
    color: Colors.blue1,
  },
});

export default observer(DefinePassword);
