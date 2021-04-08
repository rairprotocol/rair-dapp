
const axios = require('axios')

async function retrieveContent (CID, path) {
  const response = await axios.get(`${process.env.IPFS_GATEWAY}/${CID}/${path}`)
  return response.data
}

async function retrieveMediaInfo (mediaCID) {
  return retrieveContent(mediaCID, 'rair.json')
}

async function addPin (CID) {
  const response = await axios.post(`${process.env.IPFS_API}/api/v0/pin/add?arg=${CID}`)
  return response.data
}

async function removePin (CID) {
  const response = await axios.post(`${process.env.IPFS_API}/api/v0/pin/rm?arg=${CID}`)
  return response.data
}

module.exports = {
  retrieveContent,
  retrieveMediaInfo,
  addPin,
  removePin
}
