const crypto = require('crypto')
const stream = require('stream')

// Will decrypt of the key and IV are present in the mediaConfig.
const streamDecrypter = req => {
  const reg = /^\/(.*)\..*/;
  const { key, encryptionType } = req.mediaConfig
  if ((key && key.data) || (key.key && key.key.data && key.authTag)) {
    const iv = intToByteArray(parseInt(req.filePath.match(/([0-9]+).ts/)[1]))

    // Support previous version of encryption
    if (encryptionType !== 'aes-256-gcm') {
      const keyBuffer = Buffer.from(key.data)
      return crypto.createDecipheriv(encryptionType, keyBuffer, iv)
    }

    // support encryption aes-256-gcm
    const keyBuffer = Buffer.from(key.key.data)
    const authTag = key.authTag[req.filePath.match(reg)[1]];
    let decipher = crypto.createDecipheriv(encryptionType, keyBuffer, iv);
    return decipher.setAuthTag(Buffer.from(authTag, 'hex'));
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
