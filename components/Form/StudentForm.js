/* eslint-disable camelcase */
import React, { useState } from 'react';
import { Formik } from 'formik';
import { observer } from 'mobx-react';
import { Text, View } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import Toast from 'react-native-toast-message';

import { useStore } from '../../hooks/useStore';
import useCamera from '../../hooks/useCamera';
import parseDate from '../../utils/parseDate';
import resizeImage from '../../utils/resizeImage';

import { SYSTEM_INSTABILITY } from '../../constants/Messages';

import {
  studentInitialValues,
  studentValidationSchema,
  AvatarEdit,
  StudentFields,
  Buttons,
  style,
} from './FormsDefinitions';

const StudentForm = () => {
  const store = useStore();
  const navigation = useNavigation();
  const [userImage, setUserImage] = useState('');
  const openCamera = useCamera();

  const editImage = async () => {
    try {
      const image = await openCamera();
      if (image) {
        const resizedImage = await resizeImage(image);
        if (resizedImage?.uri) setUserImage(resizedImage.uri);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'failure',
        text1: 'Não é possível utilizar esta imagem.',
      });
    }
  };

  const onSubmit = async (values) => {
    try {
      const {
        name,
        lastName: last_name,
        cpf,
        birthdate,
        phone,
        email,
      } = values;

      const payload = {
        ...store.studentStore.studentRegisterData,
        image: userImage,
        name,
        last_name,
        cpf,
        role: 'student',
        email,
        birthdate: parseDate(birthdate),
        ddd: phone.replace(/\(/g, '').replace(/\)/g, '').substring(0, 2),
        telephone: phone.split(' ')[1],
        public_whatsapp: phone,
        // address_cep: '88036-003',
        // address: 'Rua Lauro Linhares',
        // address_number: '2123',
        // address_complement: 'Sala 107-109, Torre A',
        // address_neighborhood: 'Trindade',
        // address_city: 'Florianópolis',
        // address_state: 'SC',
      };

      await store.studentStore.setStudentRegisterData(payload);
      navigation.navigate('DefinePassword');
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
    }
  };

  return (
    <Formik
      initialValues={studentInitialValues}
      validationSchema={studentValidationSchema}
      onSubmit={onSubmit}
    >
      {({
        setFieldTouched,
        setFieldValue,
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        values,
        errors,
        isValid,
        isSubmitting,
      }) => (
        <View style={style.inner}>
          <AvatarEdit source={userImage} onPress={editImage} />
          <Text style={style.header}>Dados pessoais</Text>
          <StudentFields
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            values={values}
            errors={errors}
          />
          <Buttons
            handleSubmit={handleSubmit}
            isValid
            // isValid={isValid}
            isSubmitting={isSubmitting}
          />
        </View>
      )}
    </Formik>
  );
};

export default observer(StudentForm);
