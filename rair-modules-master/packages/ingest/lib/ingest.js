const ffmpeg = require("./ffmpeg-mp4.js") // TODO: Don't package this, have its own repo
const JSZip = require("jszip");
const infile = 'input.mp4'

const ingest = {}

/**
 * Takes a Buffer or Uint8Array containing the video file.
 * Produces an array of { name, data } pairs with each being a chunk of the encoded HLS
 * payload. This will also includes the playlist files (e.g. master.m3u8).
 * 
 * @param {[type]} input       Anything that can be converted into a Uint8Array.
 *                             Must contain the video file in a supported format
 * @param {string} format      the format of the video. Default mp4
 * @returns {Array<{name: string, data: Buffer}>} The encoded HLS files
 */
ingest.encodeHLS = function (input, format='mp4', handlers = { print: () => {}, printErr: () => {}, onExit: () => {} }) {
  const infile = "input."+format
  const args = [
    "-i", infile,
    "-preset", "ultrafast",
    "-hls_playlist_type", "vod",
    "-hls_segment_filename", `segment_%03d.ts`,
    "-hls_time", "10", // number of seconds per HLS block (ideal, actually contrained by keyframes)
    "-y", "master.m3u8"
  ]
  const inputArray = new Uint8Array(input);
  const result = ffmpeg({
    MEMFS : [{name: infile, data: inputArray}],
    arguments: args,
    ...handlers
  });
  return result.MEMFS
}

// returns a promise to encrypt a piece of data using aes-cbc as a given segment
function encryptSegmentBrowser(data, segmentNumber, key) {
  let iv = new Uint8Array(16);
  iv[0] = segmentNumber; // this only works for up to 256 segments
  return crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv
    },
    key,
    data
  );
}

/**
 * Encrypt a collection of HLS blocks using browser SubtleCrypto
 * @param  {Array<{name: string, data: Buffer}>} hlsData An array of file chunks, the output from encodeHLS
 * @param  {[type]} key     key is a CryptoKey containing the key to be used for encryption.
 * @return {[type]}         [description]
 */
ingest.encryptBrowser = async function (hlsData, key) {
  return Promise.all(hlsData.map(async ({name, data}) => {
    if (name.endsWith('.m3u8')) { // don't encrypt manifest files
      return {name, data}
    } else if (name.endsWith('.ts')) { // encrypt chunks
      const segmentNumber = Number.parseInt(name.match(/[0-9]+/))
      const encryptedData = await encryptSegmentBrowser(data, segmentNumber, key)

      return { data: new Uint8Array(encryptedData), name }
    } else {
      throw new Error('Invalid file extension in input', name)
    }
  }))
}

/**
 * Takes a collection of files (as output from encodeHLS or encrypt) and 
 * builds a zip file
 * Returns a promise that resolves to the blob of the zip file
 */
ingest.bundleAsZip = async function (hlsData) {
  const zip = new JSZip()
  for (const file of hlsData) {
    zip.file(file.name, file.data)
  }
  return zip.generateAsync({type:"blob"})
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

module.exports = ingest 
