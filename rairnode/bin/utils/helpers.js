const { exec } = require('child_process');

const execPromise = (command, options = {}) => new Promise((resolve, reject) => {
  exec(command, options, (error, stdout, stderr) => {
    if (error) {
      return reject(error);
    }
    return resolve();
  });
});

const executePromisesSequentially = ({items, action}) => {
  return items.reduce((p, item) => {
     return p.then(() => action(item));
  }, Promise.resolve()); // initial
};

module.exports = {
  execPromise,
  executePromisesSequentially
}
