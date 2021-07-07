const axios = require('axios');
const _ = require('lodash');

async function pinByHash(CID) {
  const response = await axios.post(
    `${ process.env.PINATA_HOST }/pinning/pinByHash`,
    { hashToPin: CID },
    {
      headers: {
        pinata_api_key: process.env.PINATA_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
  return response.data;
}

async function unpin(CID) {
  const response = await axios.delete(
    `${ process.env.PINATA_HOST }/pinning/unpin/${ CID }`,
    {
      headers: {
        pinata_api_key: process.env.PINATA_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

  return response.data;
}

module.exports = {
  pinByHash,
  unpin
};
