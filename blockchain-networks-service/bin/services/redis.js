const { promisify } = require('util');

module.exports = context => {
  const getAsync = promisify(context.redis.client.get).bind(context.redis.client);
  const setAsync = promisify(context.redis.client.set).bind(context.redis.client);

  const set = (key, object) => {
    const value = JSON.stringify(object);

    return setAsync(key, value);
  };
  const get = async (key) => {
    const value = await getAsync(key);

    console.log(value);
    if (!value) return value;

    return JSON.parse(value);
  };

  return {
    set,
    get
  }
};
