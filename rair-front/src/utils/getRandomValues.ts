//@ts-nocheck
export const getRandomValues = () => {
  const array = new Uint32Array(10);
  window.crypto.getRandomValues(array);
  let random = NaN;
  for (let i = 0; i < array.length; i++) {
    random = array[i];
  }
  return random;
};
