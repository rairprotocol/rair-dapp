const { http, https } = require('follow-redirects')
const stream = require('stream')

var httpProvider = {}

httpProvider.exists = function (req, cb) {
  // File exists and is ready to start streaming. This is always true because all requests are proxied to the same stream
  // Also makes it quicker to not do a HTTP request here
  cb(null, true) 
}

function getGenericStream (req, cb) {
  const httpLib = req.proxyUrl.startsWith('https') ? https : http
  httpLib
  .get(req.proxyUrl, function (res) {
    if (res.statusCode === 200) {
      cb(null, res)
    } else {
      cb(new Error("Could not retrieve file", req.proxyUrl), null)
    }
  })
  .on('error', e => {
    cb(e)
  })
}

httpProvider.getGenericStream = getGenericStream
httpProvider.getManifestStream = getGenericStream
httpProvider.getSegmentStream = getGenericStream

module.exports = httpProvider
