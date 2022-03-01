/* eslint-disable react/prop-types */
import React from 'react';
import StudentForm from '../../components/Form/StudentForm';
import { Screen } from '../../components/Screen/Screen';

const Register = () => (
  <Screen unsafe hideScroll keyboardOffset="xl" preset="scroll">
    <StudentForm />
  </Screen>
);

export default Register;
