import * as SecureStore from 'expo-secure-store';

const getLoginStoredData = async () => {
  const storedGoogleData = await SecureStore.getItemAsync(
    'edtechProfessorGoogleData',
  );

  if (storedGoogleData?.length) {
    const { rememberLoginData, googleToken } = JSON.parse(storedGoogleData);

    if (rememberLoginData && googleToken?.length) {
      return {
        rememberLoginData,
        googleToken,
      };
    }

    return null;
  }

  const storedData = await SecureStore.getItemAsync('edtechProfessorLoginData');

  if (storedData?.length) {
    const { rememberLoginData, email, password } = JSON.parse(storedData);

    if (rememberLoginData && email?.length && password?.length) {
      return {
        rememberLoginData,
        email,
        password,
      };
    }

    return null;
  }

  return null;
};

export default getLoginStoredData;
