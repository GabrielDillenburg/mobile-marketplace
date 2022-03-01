import React from 'react';

import ResponsibleForm from '../../components/Form/ResponsibleForm';
import { Screen } from '../../components/Screen/Screen';

const RegisterResponsible = () => (
  <Screen unsafe hideScroll preset="scroll" keyboardOffset="xl">
    <ResponsibleForm />
  </Screen>
);

export default RegisterResponsible;
