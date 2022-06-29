const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ipfsClient = require('ipfs-http-client');
const _ = require('lodash');
const log = require('../../utils/logger')(module);
const config = require('../../config');

const { api } = config.ipfs;

const addPin = async (CID, name, socketInstance) => {
  try {
    const response = await axios.post(`${api}/api/v0/pin/add?arg=${CID}`);

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

const addFolder = async (pathTo, folderName, socketInstance) => {
  const files = fs.readdirSync(pathTo);
  const ipfs = ipfsClient(api);
  const ipfsPath = `/data/files/${folderName}`;

  await ipfs.files.mkdir(ipfsPath, { parents: true });

  await Promise.all(_.map(files, (file) => {
    socketInstance.emit('uploadProgress', { message: `added to ipfs file ${file}`, last: false, part: true });
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
};

module.exports = {
  addPin,
  addFolder,
};
