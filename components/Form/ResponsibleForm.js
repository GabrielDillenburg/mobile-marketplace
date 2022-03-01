/* eslint-disable camelcase */
import React from 'react';
import { Formik } from 'formik';
import { observer } from 'mobx-react';
import { Text, View } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import Toast from 'react-native-toast-message';

import { useStore } from '../../hooks/useStore';
import { SYSTEM_INSTABILITY } from '../../constants/Messages';

import {
  guardianInitialValues,
  guardianValidationSchema,
  GuardianFields,
  Buttons,
  style,
} from './FormsDefinitions';

const ResponsibleForm = () => {
  const store = useStore();
  const navigation = useNavigation();

  const onSubmit = async (values) => {
    try {
      const {
        guardianRelationship: relatedness,
        guardianName: name,
        guardianLastName: last_name,
        guardianEmail: contact_email,
        guardianCpf: cpf,
        guardianPhone,
      } = values;

      const payload = {
        ...store.studentStore.studentRegisterData,
        responsible: {
          relatedness,
          name,
          last_name,
          contact_email,
          cpf,
          birthdate: '1971-01-01',
          ddd: guardianPhone
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .substring(0, 2),
          telephone: guardianPhone.split(' ')[1],
          public_whatsapp: guardianPhone,
        },
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
      initialValues={guardianInitialValues}
      validationSchema={guardianValidationSchema}
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
        isSubmitting,
      }) => (
        <View style={style.inner}>
          <Text style={style.header}>Dados do responsável</Text>
          <GuardianFields
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

export default observer(ResponsibleForm);
