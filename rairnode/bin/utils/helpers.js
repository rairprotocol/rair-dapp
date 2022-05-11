const { exec } = require('child_process');

const execPromise = (command, options = {}) => new Promise((resolve, reject) => {
  exec(command, options, (error, stdout, stderr) => {
    if (error) {
      return reject(error);
    }
    return resolve();
  });
});

module.exports = {
  execPromise,
}
