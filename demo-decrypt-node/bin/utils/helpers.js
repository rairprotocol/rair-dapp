const { exec } = require('child_process');

const execPromise = (command, options = {}) => new Promise((resolve, reject) => {
  exec(command, options, (error, stdout, stderr) => {
    if (error) {
      return reject(error);
    }
    return resolve();
  });
});

const getClients = (context) => ({
  publisher: context.pubSub.duplicate(),
  subscriber: context.pubSub.duplicate()
});

const unsubscribeClose = (subscriber, publisher = null) => {
  if (subscriber) {
    subscriber.unsubscribe();
    subscriber.quit();
  }

  if (publisher) publisher.quit();
};

module.exports = {
  execPromise,
  getClients,
  unsubscribeClose
}
