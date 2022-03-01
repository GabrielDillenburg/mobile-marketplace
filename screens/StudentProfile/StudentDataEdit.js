import React from 'react';

import EditForm from '../../components/Form/EditForm';
import { Screen } from '../../components/Screen/Screen';

const StudentDataEdit = () => (
  <Screen unsafe hideScroll keyboardOffset="xl" preset="scroll">
    <EditForm />
  </Screen>
);

export default StudentDataEdit;
