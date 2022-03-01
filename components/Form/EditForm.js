/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { observer } from 'mobx-react';
import { Text, View /* , Separator */ } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import Toast from 'react-native-toast-message';
import { flowResult } from 'mobx';

import { useStore } from '../../hooks/useStore';
import useCamera from '../../hooks/useCamera';
import formatDate from '../../utils/formatDate';
import parseDate from '../../utils/parseDate';
import resizeImage from '../../utils/resizeImage';

import { SYSTEM_INSTABILITY } from '../../constants/Messages';

import {
  studentInitialValues,
  studentValidationSchema,
  StudentFields,
  guardianInitialValues,
  // guardianValidationSchema,
  // GuardianFields,
  Buttons,
  style,
  AvatarEdit,
} from './FormsDefinitions';

const StudentForm = () => {
  const store = useStore();
  const navigation = useNavigation();
  const [userImage, setUserImage] = useState('');
  const openCamera = useCamera();
  const [initialValues, setInitialValues] = useState({
    ...studentInitialValues,
    ...guardianInitialValues,
  });

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
        // email: contact_email,
        guardianName,
        guardianLastName,
        guardianCpf,
        guardianRelationship: relatedness,
        guardianPhone,
        guardianEmail,
      } = values;

      const editProfilePayload = {
        image: userImage,
        name,
        last_name,
        cpf: cpf?.length ? cpf : null,
        birthdate: parseDate(birthdate),
        ddd: phone.replace(/\(/g, '').replace(/\)/g, '').substring(0, 2),
        telephone: phone.split(' ')[1],
        public_whatsapp: phone,
        responsible: {
          relatedness,
          name: guardianName,
          last_name: guardianLastName,
          contact_email: guardianEmail,
          cpf: guardianCpf,
          birthdate: '1971-01-01',
          ddd: guardianPhone
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .substring(0, 2),
          telephone: guardianPhone.split(' ')[1],
          public_whatsapp: guardianPhone,
        },
      };

      await store.studentStore.setStudentRegisterData(editProfilePayload);

      const studentProfileRes = await flowResult(
        store.studentStore.register(true),
      );

      if (studentProfileRes) {
        // const reponsibleProfileRes = await flowResult(
        //   store.studentStore.saveResponsible(),
        // );

        // if (reponsibleProfileRes) {
        Toast.show({
          type: 'success',
          text1: 'Pefil editado com sucesso!',
        });

        navigation.navigate('StudentData');
        return;
        // }

        // Toast.show({
        //   type: 'failure',
        //   text1:
        //     SYSTEM_INSTABILITY,
        // });

        // return;
      }

      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'failure',
        text1: SYSTEM_INSTABILITY,
      });
    }
  };

  useEffect(() => {
    const { student } = store.studentStore;
    setUserImage(student.image);

    // const {
    //   name: guardianName,
    //   lastName: guardianLastName,
    //   relationship: guardianRelationship,
    //   cpf: guardianCpf,
    //   phone: guardianPhone,
    //   ddd: guardianDDD,
    //   email: guardianEmail,
    // } = store?.responsibleStore?.responsible;

    setInitialValues({
      ...initialValues,
      ...student,
      phone: `${student?.ddd}${student?.phone}`,
      birthdate: formatDate(student.birthdate),
      noCpf: !student?.cpf?.length,
      // guardianName,
      // guardianLastName,
      // guardianRelationship,
      // guardianCpf,
      // guardianPhone: `${guardianDDD}${guardianPhone}`,
      // guardianEmail,
    });
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={studentValidationSchema.concat(
      //   guardianValidationSchema,
      // )}
      validationSchema={studentValidationSchema}
      onSubmit={onSubmit}
      enableReinitialize
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
        <>
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
              editing
            />
          </View>
          {/* <Separator style={style.separator} /> */}
          <View style={style.inner}>
            {/* <Text style={style.header}>Dados do responsável</Text>
              <GuardianFields
                handleChange={handleChange}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                values={values}
                errors={errors}
                editing
              /> */}
            <Buttons
              handleSubmit={handleSubmit}
              isValid
              // isValid={isValid}
              isSubmitting={isSubmitting}
            />
          </View>
        </>
      )}
    </Formik>
  );
};

export default observer(StudentForm);
