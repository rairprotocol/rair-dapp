const { getClients } = require('./helpers')

const syncTokens = context => {
  const { publisher, subscriber } = getClients(context);

  subscriber.subscribe('sync-tokens');

  subscriber.on('message', async (channel, message) => {
    try {
      const value = await context.redis.redisService.get(channel)

      if (!value || !value.inProgress) {
        await context.redis.redisService.set(channel, { message, inProgress: true });
      }

      if (value && value.inProgress) {
        console.log('Sync of tokens currently running', channel);
        return;
      }

      console.log(message, channel);

      setTimeout(async () => {
        publisher.publish('syncOut', JSON.stringify({ flag: channel, txt: 'Tokens is synced.' }));

        await context.redis.redisService.set(channel, { message, inProgress: false });
      }, 10000);
    } catch (e) {
      await context.redis.redisService.set(channel, { message, inProgress: false });
    }
  });
};

const syncContracts = context => {
  const { publisher, subscriber } = getClients(context);

  subscriber.subscribe('sync-contracts');

  subscriber.on('message', async (channel, message) => {
    try {

      console.log('In sync contracts');

      const value = await context.redis.redisService.get(channel)

      if (!value || !value.inProgress) {
        await context.redis.redisService.set(channel, { message, inProgress: true });
      }

      if (value && value.inProgress) {
        console.log('Sync of contracts currently running', channel);
        return;
      }

      console.log(message, channel);

      setTimeout(async () => {
        publisher.publish('syncOut', JSON.stringify({ flag: channel, txt: 'Contracts is synced.' }));

        await context.redis.redisService.set(channel, { message, inProgress: false });
      }, 10000);
    } catch (e) {
      await context.redis.redisService.set(channel, { message, inProgress: false });
    }
  });
};

module.exports = context => {
  syncTokens(context);
  syncContracts(context);
};
