const pinataSDK = require('@pinata/sdk');
const axios = require('axios');
const _ = require('lodash');
const AppError = require('../../utils/errors/AppError');
const log = require('../../utils/logger')(module);
const config = require('../../config');

const { gateway, key, secret } = config.pinata;

const pinata = pinataSDK(key, secret);
const retrieveMediaInfo = (CID) => axios.get(`${gateway}/${CID}/rair.json`);

const addPin = async (CID, name) => {
  try {
    const response = await pinata.pinByHash(CID, {
      pinataMetadata: {
        name: `RAIR_${name}`,
      },
    });

    log.info(`Pinned to PINATA: ${JSON.stringify(response)}`);
  } catch (err) {
    log.error(`Pinning to PINATA: ${err.message}`);
  }
};

const removePin = async (CID) => {
  try {
    const response = await pinata.unpin(CID);

    log.info(`Unpin PINATA: ${CID}, status: ${response}`);

    return response;
  } catch (err) {
    log.error(`Could not remove pin from PINATA ${CID}: ${err}`);
    return {};
  }
};

const addFolder = async (pathTo, folderName) => {
  try {
    const response = await pinata.pinFromFS(pathTo, {
      pinataMetadata: {
        name: folderName,
      },
    });

    return _.get(response, 'IpfsHash');
  } catch (e) {
    log.error(e.message);
    return new AppError('Can\'t store folder in Pinata.', 500);
  }
};

const addMetadata = async (data, name) => {
  const response = await pinata.pinJSONToIPFS(data, {
    pinataMetadata: {
      name,
    },
  });

  return _.get(response, 'IpfsHash');
};

const addFile = async (pathTo, name) => {
  const response = await pinata.pinFromFS(pathTo, {
    pinataMetadata: {
      name,
    },
  });

  return _.get(response, 'IpfsHash');
};

module.exports = {
  retrieveMediaInfo,
  removePin,
  addPin,
  addFolder,
  addMetadata,
  addFile,
};
