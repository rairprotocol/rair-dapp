#!/usr/bin/env node
const HLSServer = require('../lib')
const http = require('http')
const fs = require('fs');
const crypto = require('crypto')
const stream = require('stream')

var argv = require('yargs')
  .usage('Serve HLS media')
  .help('help').alias('help', 'h')
  .version('version', '0.0.1').alias('version', 'V')
  .command('* <config>', 'Run the HLS server', yargs => {
    yargs
    .positional('config', {
        describe: 'path to a json file to configure the media paths and keys.',
        type: 'string'
      })
    .options({
      port: {
        alias: 'p',
        description: "<port> Port to host on",
        default: 8000
      }
    })
  })
  .argv;

// Will decrypt of the key and IV are present in the mediaConfig.
const streamDecrypter = req => {
  const { key, iv } = req.mediaConfig
  if (key && iv) {
    return crypto.createDecipheriv('aes-128-cbc', key, iv)
  } else {
    return new stream.PassThrough()
  }
}

const server = http.createServer()
const mediaConfig = JSON.parse(fs.readFileSync(argv.config, 'utf8'));
// replace all the key paths with keys. An optimization
for (const [key, value] of Object.entries(mediaConfig)) {
  if (value.key_path) {
    const aesKey = fs.readFileSync(value.key_path)
    mediaConfig[key].key = aesKey
  }
}

const hls = new HLSServer(server, { 
  mediaConfig,
  segmentTransformation: streamDecrypter
})

console.log(`Listening at http:localhost:${argv.port}`)
server.listen(argv.port)
