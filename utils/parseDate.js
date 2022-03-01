const parseDate = (date) => {
  if (date?.length) {
    const [day, month, year] = date.split('/');

    if (day?.length && month?.length && year?.length) {
      return `${year}-${month}-${day}`;
    }
  }

  return date;
};

export default parseDate;
