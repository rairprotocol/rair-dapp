const customValidator = (length = { min: 1, max: 30 }) => (value, helpers) => {
  if (value === 'undefined' || value === 'null') {
    throw new Error('have an incorrect value');
  }

  if (length && value.length < length.min) {
    throw new Error(`should be more than ${length.min} character`);
  }

  if (length && value.length > length.max) {
    throw new Error(`should be less than ${length.max} characters`);
  }

  return value;
};

module.exports = {
  customValidator,
};
