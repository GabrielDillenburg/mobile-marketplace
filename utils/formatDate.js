const formatDate = (date) => {
  if (date?.length) {
    const [year, month, day] = date.split('-');

    if (year?.length && month?.length && day?.length) {
      return `${day}/${month}/${year}`;
    }
  }

  return date;
};

export default formatDate;
