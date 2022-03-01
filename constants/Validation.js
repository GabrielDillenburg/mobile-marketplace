import * as Yup from 'yup';
import isCPF from '../utils/cpfValidation';

// DELETE!
const Validations = {
  required: '* Campo obrigatório',
  email: '* E-mail inválido',
  min: ({ min }) => `* Mínimo de ${min} caracteres `,
  passwordConfirm: '* Senhas não coincidem',
  cpf: '* CPF Inválido',
};
export default Validations;
// END DELETE

const ValidationMessages = {
  required: '* Campo obrigatório',
  email: '* E-mail inválido',
  min: ({ min }) => `* Mínimo de ${min} caracteres `,
  passwordConfirm: '* Senhas não coincidem',
  cpf: '* CPF Inválido',
  birthdate: 'Formato de data: dia/mês/ano',
  phone: 'Formato de celular: (99) 99999-9999',
};

const ValidationRules = {
  string: Yup.string().required(ValidationMessages.required),

  cpf: Yup.string()
    .test('is-cpf', ValidationMessages.cpf, (value) => isCPF(value))
    .required(ValidationMessages.required),

  birthdate: Yup.string()
    // Basic regex for birthdates
    .matches(
      /[0-3]?[0-9]\/[0-1]?[0-9]\/(19|20)?[0-9]{2}$/,
      ValidationMessages.birthdate,
    )
    .required(ValidationMessages.required),

  phone: Yup.string()
    .matches(
      /^\(?([0-9]{2})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{4})$/,
      ValidationMessages.phone,
    )
    .required(ValidationMessages.required),
  // Basic regex to validate phone number (mobile or landline); to be improved to match masks.
  // .matches(/^([0-9]{2}[ ])?[0-9]{5}[ -]*[0-9]{4}$/)

  email: Yup.string()
    .email(ValidationMessages.email)
    .required(ValidationMessages.required),
};

export { ValidationMessages, ValidationRules };
