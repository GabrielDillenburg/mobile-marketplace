/* eslint-disable camelcase */
const createLink = (location) => {
  const {
    address,
    address_city,
    address_neighborhood,
    address_number,
    address_state,
  } = location;

  const format = (text) => text.replace(/ +/g, '+').replace(/#+/g, '');

  const link = `https://www.google.com.br/maps/place/${address}+${address_number},+${address_neighborhood},+${address_city},+${address_state},+Brasil/`;

  return format(link);
};

export default createLink;
