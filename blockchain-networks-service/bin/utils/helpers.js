const BigNumber = value => Number(value.toString());

const BigNumberFromFunc = async (func, params) => {
  if (params) {
    return Number((await func(...params)).toString());
  }
  return Number((await func()).toString());
}

module.exports = {
  BigNumber,
  BigNumberFromFunc
}
