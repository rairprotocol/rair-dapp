const ethers = require('ethers');

const BigNumber = value => Number(value.toString());

const BigNumberFromFunc = async (func, params) => {
  if (params) {
    return Number((await func(...params)).toString());
  }
  return Number((await func()).toString());
}

const numberToHexadecimal = number => '0x' + Number(number).toString(16);

const getABIData = (abi, type, eventName) => {
  const [resultingAbi] = abi.filter(item => {
    return item.type === type && item.name === eventName
  })
  const instance = new ethers.Contract(ethers.constants.AddressZero, abi);
  const [topic] = Object.keys(instance.filters).filter(item => item.includes(`${eventName}(`)).map(item => {
    return ethers.utils.id(item);
  });
  return {abi: resultingAbi, topic};
};

module.exports = {
  BigNumber,
  BigNumberFromFunc,
  numberToHexadecimal,
  getABIData
}
