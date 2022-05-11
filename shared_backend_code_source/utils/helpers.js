const executePromisesSequentially = ({items, action}) => {
  return items.reduce((p, item) => {
     return p.then(() => action(item));
  }, Promise.resolve()); // initial
};

module.exports = {
  executePromisesSequentially
}
