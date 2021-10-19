const BigNumber = value => Number(value.toString());

const BigNumberFromFunc = async (func, params) => {
  if (params) {
    return Number((await func(...params)).toString());
  }
  return Number((await func()).toString());
}

const numberToHexadecimal = number => '0x' + Number(number).toString(16);

module.exports = {
  BigNumber,
  BigNumberFromFunc,
  numberToHexadecimal
}
