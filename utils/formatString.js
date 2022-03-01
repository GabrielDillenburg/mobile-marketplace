/* eslint-disable no-underscore-dangle */
function formatString(str) {
  const removeSpecialCharacters = /[\u0300-\u036f]/g;
  const removeEmptySpace = /\s/g;
  return str
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(removeSpecialCharacters, '')
    .replace(removeEmptySpace, '');
}

const snake2Camel = (string) =>
  string.replace(/[_||\s]\w/g, (m) => m.replace(/[_||\s]/, '').toUpperCase());

const keys2Camel = (o) => {
  const _o = {};

  Object.keys(o).forEach((k) => {
    const _k = snake2Camel(k);
    _o[_k] = o[k];
  });

  return _o;
};

export { snake2Camel, keys2Camel, formatString };
