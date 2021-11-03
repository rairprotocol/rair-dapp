const { getClients } = require('./helpers')

const syncTokens = context => {
  const { publisher, subscriber } = getClients(context);

  subscriber.subscribe('sync-tokens');

  subscriber.on('message', (channel, message) => {
    console.log(message, channel);

    setTimeout(() => {
      publisher.publish('syncOut', JSON.stringify({ txt: 'Tokens is synced.' }));
    }, 5000);
  });
};

const syncContracts = context => {
  const { publisher, subscriber } = getClients(context);

  subscriber.subscribe('sync-contracts');

  subscriber.on('message', (channel, message) => {
    console.log(message, channel);

    setTimeout(() => {
      publisher.publish('syncOut', JSON.stringify({ txt: 'Contracts is synced.' }));
    }, 5000);
  });
};

module.exports = context => {
  syncTokens(context);
  syncContracts(context);
};
