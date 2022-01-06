const crypto = require('crypto')
const stream = require('stream')

// Will decrypt of the key and IV are present in the mediaConfig.
const streamDecrypter = req => {
  const { key } = req.mediaConfig
  if (key && key.data) {
    const keyBuffer = Buffer.from(key.data)
    const iv = intToByteArray(parseInt(req.filePath.match(/([0-9]+).ts/)[1]))
    return crypto.createDecipheriv('aes-128-cbc', keyBuffer, iv)
  } else {
    return new stream.PassThrough()
  }
}

/**
 * intToByteArray Convert an integer to a 16 byte Uint8Array (little endian)
 */
function intToByteArray (num) {
  var byteArray = new Uint8Array(16)
  for (var index = 0; index < byteArray.length; index++) {
    var byte = num & 0xff
    byteArray[index] = byte
    num = (num - byte) / 256
  }
  return byteArray
}

module.exports = streamDecrypter
