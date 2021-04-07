const streamDecrypter = require('./stream-decrypter')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const HLSServer = require('@rair/hls-server')

module.exports = async () => {
	const db = await low(new FileAsync('store.json'))

	return HLSServer({
		mediaConfigStore: async mediaId => {
		  const config = await db.get(['mediaConfig', mediaId], undefined).value()
		  config.uri = process.env.IPFS_GATEWAY + '/' + mediaId
		  return config
		},
		segmentTransformation: streamDecrypter,
		authCallback: req => req.token && req.token.media_id === req.mediaId
	})	
}
