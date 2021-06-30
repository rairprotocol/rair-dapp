const axios = require('axios')
const fs = require('fs');
const path = require('path')
const ipfsClient = require('ipfs-http-client')
const _ = require('lodash');

async function retrieveContent(CID, path) {
  const response = await axios.get(`${ process.env.IPFS_GATEWAY }/${ CID }/${ path }`)
  return response.data
}

async function retrieveMediaInfo(mediaCID) {
  return retrieveContent(mediaCID, 'rair.json')
}

async function addPin(CID) {
  const response = await axios.post(`${ process.env.IPFS_API }/api/v0/pin/add?arg=${ CID }`)
  return response.data
}

async function removePin(CID) {
  const response = await axios.post(`${ process.env.IPFS_API }/api/v0/pin/rm?arg=${ CID }`)
  return response.data
}

async function addFolder(pathTo, folderName, socketInstance, args = {}) {
  const files = fs.readdirSync(pathTo);
  const ipfs = ipfsClient(process.env.IPFS_API);
  const ipfsPath = `/data/files/${ folderName }`

  await ipfs.files.mkdir(ipfsPath, { parents: true });

  await Promise.all(_.map(files, (file) => {
    const filePath = path.join(pathTo, '/', file);
    const data = fs.readFileSync(filePath);


    socketInstance.emit('uploadProgress', `added to ipfs file ${file}`);


    return ipfs.files.write(path.join(ipfsPath, '/', file), data, { create: true });
  }));

  return ipfs.files.stat(ipfsPath);
}

module.exports = {
  retrieveContent,
  retrieveMediaInfo,
  addPin,
  removePin,
  addFolder
}
