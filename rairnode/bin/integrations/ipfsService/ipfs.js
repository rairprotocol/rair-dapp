const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ipfsClient = require('ipfs-http-client');
const _ = require('lodash');
const AppError = require('../../utils/errors/AppError');
const log = require('../../utils/logger')(module);

const retrieveMediaInfo = async (CID) => {
  const response = await axios.get(`${process.env.IPFS_GATEWAY}/${CID}/rair.json`);
  return response.data;
};

const addPin = async (CID, name, socketInstance) => {
  try {
    const response = await axios.post(`${process.env.IPFS_API}/api/v0/pin/add?arg=${CID}`);

    log.info(`Pinned to IPFS: ${JSON.stringify(response.data)}`);

    if (!_.isUndefined(socketInstance)) {
      socketInstance.emit('uploadProgress', {
        message: 'Pinned to IPFS.',
        last: true,
        done: 100,
      });
    }
  } catch (err) {
    log.error(`Pinning to IPFS: ${err.message}`);
  }
};

const removePin = async (CID) => {
  try {
    const response = await axios.post(`${process.env.IPFS_API}/api/v0/pin/rm?arg=${CID}`);

    log.info(`Unpin IPFS: ${response.data.Pins}`);

    return response.data;
  } catch (err) {
    log.error(`Could not remove pin from IPFS ${CID}: ${err}`);
    return {};
  }
};

const addFolder = async (pathTo, folderName, socketInstance) => {
  try {
    const files = fs.readdirSync(pathTo);
    const ipfs = ipfsClient(process.env.IPFS_API);
    const ipfsPath = `/data/files/${folderName}`;

    await ipfs.files.mkdir(ipfsPath, { parents: true });

    await Promise.all(_.map(files, (file) => {
      if (!_.isUndefined(socketInstance)) {
        socketInstance.emit('uploadProgress', { message: `added to ipfs file ${file}`, last: false, part: true });
      }

      const filePath = path.join(pathTo, '/', file);
      const data = fs.readFileSync(filePath);

      return ipfs.files.write(path.join(ipfsPath, '/', file), data, { create: true });
    }));

    const result = await ipfs.files.stat(ipfsPath);

    return _.chain(result.cid)
      .split('(')
      .last()
      .split(')')
      .first()
      .value();
  } catch (e) {
    log.error(e.message);
    return new AppError('Can\'t store folder in IPFS.', 500);
  }
};

const addMetadata = async (data, name) => {
  const ipfs = ipfsClient(process.env.IPFS_API);

  return ipfs.add(data);
};

const addFile = async (pathTo, name) => {
  try {
    const ipfs = ipfsClient(process.env.IPFS_API);
    const ipfsPath = `/data/files/${name}`;
    const data = fs.readFileSync(path.join(pathTo, '/', name));

    await ipfs.files.mkdir(ipfsPath, { parents: true });
    await ipfs.files.write(path.join(ipfsPath, '/', name), data, { create: true });

    const result = await ipfs.files.stat(ipfsPath);

    return _.chain(result.cid)
      .split('(')
      .last()
      .split(')')
      .first()
      .value();
  } catch (e) {
    log.error(e.message);
    return new AppError('Can\'t store file in IPFS.', 500);
  }
};

module.exports = {
  retrieveMediaInfo,
  addPin,
  removePin,
  addFolder,
  addMetadata,
  addFile,
};
