/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { flowResult } from 'mobx';
import { View, Button as NBButton } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { observer } from 'mobx-react';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import * as GoogleAuth from 'expo-google-app-auth';

import { useStore } from '../../hooks/useStore';

import Button from '../../components/Button/Button';
import Text from '../../components/Text/Text';
import FloatedInput from '../../components/Input/FloatedInput';
import CheckBox from '../../components/Selectors/CheckBox';
import Logo from '../../components/Logo/Logo';

import rem from '../../utils/rem';
import openUrl from '../../utils/openUrl';
import GoogleIcon from '../../utils/svg/GoogleIcon';
import getLoginStoredData from '../../utils/getLoginStoredData';

import Colors from '../../constants/Colors';
import Validations from '../../constants/Validation';

import { SYSTEM_INSTABILITY } from '../../constants/Messages';

import {
  ANDROID_CLIENT_ID,
  ANDROID_EXPO_CLIENT_ID,
  IOS_CLIENT_ID,
  IOS_EXPO_CLIENT_ID,
} from '../../env';

const validationSchema = Yup.object().shape({
  email: Yup.string().email(Validations.email).required(Validations.required),
  password: Yup.string().required(Validations.required),
});

const Login = ({ navigation }) => {
  const mountedRef = useRef(true);
  const store = useStore();
  const passwordInput = useRef();
  const [loadingStoredData, setLoadingStoredData] = useState(true);
  const [hidePassword, setHidePassword] = useState(true);
  const [rememberLoginData, setRememberLoginData] = useState(false);
  const [initialValues, setInitialValues] = useState({
    email: '',
    password: '',
  });
  const [isFetching, setIsFetching] = useState(false);

  const navigateTo = (path) => {
    navigation.navigate(path);
  };

  const getStoredData = async () => {
    setLoadingStoredData(true);

    const loginStoredData = await getLoginStoredData();

    if (loginStoredData) {
      const {
        rememberLoginData: _rememberLoginData,
        email,
        password,
      } = loginStoredData;

      if (_rememberLoginData) {
        if (email?.length && password?.length) {
          setInitialValues({ email, password });
        }

        setRememberLoginData(_rememberLoginData);
      }
    }
  };

  const onSubmit = async ({ email, password }) => {
    try {
      setIsFetching(true);
      const res = await flowResult(
        store.authStore.authenticate(email, password),
      );

      if (res && !res?.error) {
        if (rememberLoginData) {
          await SecureStore.setItemAsync(
            'edtechProfessorLoginData',
            JSON.stringify({ email, password, rememberLoginData }),
          );
        } else {
          await SecureStore.deleteItemAsync('edtechProfessorLoginData');
        }

        await SecureStore.deleteItemAsync('edtechProfessorGoogleData');

        return;
      }

      Toast.show({
        type: 'failure',
        text1: 'E-mail ou senha inválidos.',
      });
    } catch (error) {
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
    } finally {
      if (mountedRef.current) setIsFetching(false);
    }
  };

  const socialLogin = async () => {
    try {
      setIsFetching(true);
      const { type, accessToken: googleToken } = await GoogleAuth.logInAsync({
        androidStandaloneAppClientId: ANDROID_CLIENT_ID,
        androidClientId: ANDROID_EXPO_CLIENT_ID,
        iosStandaloneAppClientId: IOS_CLIENT_ID,
        iosClientId: IOS_EXPO_CLIENT_ID,
        scopes: ['profile', 'email'],
        language: 'pt-BR',
      });

      if (type !== 'success') {
        Toast.show({
          type: 'failure',
          text1: SYSTEM_INSTABILITY,
        });
        return;
      }

      const res = await flowResult(store.authStore.socialLogin(googleToken));

      if (res) {
        const { error } = res;

        if (error === 404) {
          Toast.show({
            type: 'failure',
            text1:
              'Este e-mail não está na nossa base de dados. Por favor, realize o cadastro.',
          });

          return;
        }

        if (rememberLoginData) {
          await SecureStore.setItemAsync(
            'edtechProfessorGoogleData',
            JSON.stringify({
              googleToken,
              rememberLoginData,
            }),
          );
        } else {
          await SecureStore.deleteItemAsync('edtechProfessorGoogleData');
        }

        await SecureStore.deleteItemAsync('edtechProfessorLoginData');

        return;
      }

      Toast.show({
        type: 'failure',
        text1: 'Não foi possível realizar o login social.',
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
    } finally {
      if (mountedRef.current) setIsFetching(false);
    }
  };

  const onPressHidePassword = () => {
    setHidePassword(!hidePassword);
    passwordInput.current.focus();
  };

  const init = async () => {
    await getStoredData();
    setLoadingStoredData(false);

    if (store.authStore.sectionExpired) {
      Toast.show({
        type: 'failure',
        text1: 'Sessão expirada.',
      });
      store.authStore.setSectionExpired(false);
    }
  };

  useEffect(() => {
    init();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <ScrollView style={style.pageWrapper}>
      <View style={style.logoWrapper}>
        <Logo />
      </View>
      <Text style={style.pageTitle} fontSize={24} fontWeight="bold">
        Entrar
      </Text>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldTouched,
          setFieldValue,
          touched,
          values,
          errors,
        }) => (
          <View>
            <View style={style.loginInputsWrapper}>
              {loadingStoredData ? (
                <ActivityIndicator color={Colors.blue1} />
              ) : (
                <>
                  <FloatedInput
                    value={values.email}
                    label="E-mail"
                    onChangeText={(text) => {
                      setFieldValue('email', String(text.toLowerCase()));
                    }}
                    onBlur={() => {
                      handleBlur('email');
                      setFieldTouched('email', true);
                    }}
                    error={errors.email && touched.email ? errors.email : null}
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInput.current.focus()}
                    blurOnSubmit={false}
                  />
                  <View>
                    <FloatedInput
                      value={values.password}
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
                      secureTextEntry={hidePassword}
                      autoCapitalize="none"
                      innerRef={passwordInput}
                    />
                    <Ionicons
                      style={style.password}
                      name={hidePassword ? 'eye-off' : 'eye'}
                      size={rem(24)}
                      onPress={onPressHidePassword}
                    />
                  </View>
                </>
              )}
            </View>

            <Button
              onPress={handleSubmit}
              full
              borderRadius={rem(10)}
              loading={isFetching}
              disabled={isFetching}
            >
              <Text fontWeight="bold" color="white">
                Entrar
              </Text>
            </Button>
          </View>
        )}
      </Formik>
      <View style={style.check}>
        <View style={style.checkBoxContainer}>
          <CheckBox
            value={rememberLoginData}
            label="Lembre-se de mim"
            onCheck={() => setRememberLoginData(!rememberLoginData)}
          />
        </View>

        <Text
          onPress={() =>
            openUrl('https://painel.edtech.com.br/forgot-password')
          }
          fontSize={rem(14)}
        >
          Esqueceu a senha?
        </Text>
      </View>

      {Platform.OS === 'android' ? (
        <>
          <Text fontSize={rem(18)} style={style.text}>
            ou
          </Text>

          <NBButton
            onPress={socialLogin}
            full
            borderRadius={rem(10)}
            style={style.btGoogle}
          >
            {isFetching ? (
              <ActivityIndicator color={Colors.blue1} />
            ) : (
              <>
                <GoogleIcon />
                <Text color={Colors.black3}>Conectar com Google</Text>
              </>
            )}
          </NBButton>
        </>
      ) : null}

      <View style={style.bottomText}>
        <Text color={Colors.grey12} fontSize={16}>
          Novo por aqui?
        </Text>
        <TouchableOpacity
          style={style.registerLink}
          onPress={() => navigateTo('Register')}
        >
          <Text color={Colors.black3} fontSize={16}>
            Cadastre-se agora.
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const style = EStyleSheet.create({
  pageWrapper: {
    backgroundColor: 'white',
    paddingHorizontal: rem(30),
    flex: 1,
  },
  pageTitle: {
    alignSelf: 'flex-start',
  },
  logoWrapper: {
    alignSelf: 'center',
    marginTop: rem(84),
    marginBottom: rem(65),
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: rem(18),
  },
  text: {
    alignSelf: 'center',
    paddingVertical: rem(30),
  },
  bottomText: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rem(50),
    // marginTop: rem(180),
    marginBottom: rem(40),
  },
  password: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    color: '#545859',
  },
  registerLink: {
    marginLeft: rem(8),
  },
  loginInputsWrapper: {
    marginBottom: rem(60),
    minHeight: rem(150),
    justifyContent: 'center',
  },

  btGoogle: {
    borderWidth: rem(1),
    borderColor: 'rgba(0, 0, 0, 0.12)',
    elevation: 0,
    backgroundColor: 'transparent',
    height: rem(50),
  },
});

export default observer(Login);
