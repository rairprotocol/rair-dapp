const axios = require('axios');
const qs = require('query-string');

const  ZOOM_OAUTH_ENDPOINT =  'https://zoom.us/oauth/token'
const { redisClient } = require('../services/redis');

/**
  * Retrieve token from Zoom API
  *
  * @returns {Object} { access_token, expires_in, error }
  */
const getToken = async () => {
  try {
    const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;

    const request = await axios.post(
      ZOOM_OAUTH_ENDPOINT,
      qs.stringify({ grant_type: 'account_credentials', account_id: ZOOM_ACCOUNT_ID }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
        },
      },
    );

    const { access_token, expires_in } = await request.data;

    return { access_token, expires_in, error: null };
  } catch (error) {
    return { access_token: null, expires_in: null, error };
  }
};

/**
  * Set zoom access token with expiration in redis
  *
  * @param {Object} auth_object
  * @param {String} access_token
  * @param {int} expires_in
  */
const setToken = async ({ access_token, expires_in }) => {
  await redisClient.set('access_token', access_token);
  await redisClient.expire('access_token', expires_in);
};

module.exports = {
  getToken,
  setToken,
};
