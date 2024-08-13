import { BigNumber } from 'ethers';

const validateInteger = (number: string | number) => {
  if (
    number === undefined ||
    number.toString() === '' ||
    Number.isNaN(number)
  ) {
    return false;
  }
  try {
    BigNumber.from(number);
  } catch (err) {
    return false;
  }
  return true;
};

export { validateInteger };
