var http = require('http')
var url = require('url')
var path = require('path')
var zlib = require('zlib')
var PassThrough = require('stream').PassThrough
var httpAttach = require('http-attach')
var httpProvider = require('./httpProvider')

var CONTENT_TYPE = {
  MANIFEST: 'application/vnd.apple.mpegurl',
  SEGMENT: 'video/MP2T',
  HTML: 'text/html'
}

const EXT_CONTENT_TYPE = {
  '.vtt': 'text/plain', // HLS subtitles file
  '.json': 'application/json'
}

module.exports = function (opts) {
  opts = opts || {}
  mediaConfigStore = opts.mediaConfigStore
  segmentTransformation = opts.segmentTransformation || (() => { return new PassThrough() })
  authCallback = opts.authCallback || (() => true)

  hlsServer = {}

  hlsServer.middleware = async function (req, res, next) {
    try {
      const { mediaId } = req.params
      const filePath = url.parse(req.url).pathname
      var extension = path.extname(filePath)

      console.log('request for media', mediaId, filePath)

      const mediaConfig = await mediaConfigStore(mediaId)
      if (mediaConfig === undefined) { // the request is for unrecognised media
        next(new Error('No config exists for given media'))
      }

      const proxyUri = mediaConfig.uri
      
      req.proxyUrl = proxyUri + filePath
      req.mediaId = mediaId
      req.mediaConfig = mediaConfig
      req.filePath = filePath
      req.extension = extension

      if (!authCallback(req)) {
        next(new Error('Caller is not authorized to view media'))
      }

      // Gzip support
      var ae = req.headers['accept-encoding'] || ''
      req.acceptsCompression = ae.match(/\bgzip\b/)

      httpProvider.exists(req, function (err, exists) {
        if (err) {
          res.statusCode = 500
          res.end()
        } else if (!exists) {
          res.statusCode = 404
          res.end()
        } else {
          switch (extension) {
            case '.m3u8':
              console.log('retrieving manifest', req.fsPath || req.proxyUrl)
              _writeManifest(req, res, next, httpProvider)
              break
            case '.ts':
              console.log('retrieving segment', req.fsPath || req.proxyUrl)
              _writeSegment(req, res, next, httpProvider, segmentTransformation)
              break
            default:
              console.log('retrieving file', req.fsPath || req.proxyUrl)
              _writeGeneric(req, res, next, httpProvider)
              break
          }
        }
      })
    } catch (e) {
      next(e)
    }
  }

  return hlsServer
}

function trimLeadingSlash (str) {
  if (str[0] === '/') {
    return str.slice(1)
  } else {
    return str
  }
}

function _writeManifest (req, res, next, provider) {
  provider.getManifestStream(req, function (err, stream) {
    if (err) {
      return next(new Error(`Unable to retrieve manifest ${ req.filePath} - ${err}`))
    }

    res.setHeader('Content-Type', CONTENT_TYPE.MANIFEST)
    res.statusCode = 200

    if (req.acceptsCompression) {
      res.setHeader('content-encoding', 'gzip')
      res.statusCode = 200
      var gzip = zlib.createGzip()
      stream.pipe(gzip).pipe(res)
    } else {
      stream.pipe(res, 'utf-8')
    }
  })
}

function _writeSegment (req, res, next, provider, segmentTransformation) {
  provider.getSegmentStream(req, function (err, stream) {
    if (err) {
      return next(new Error(`Unable to retrieve segment ${ req.filePath} - ${err}`))
    }

    res.setHeader('Content-Type', CONTENT_TYPE.SEGMENT)
    res.statusCode = 200
    stream.pipe(segmentTransformation(req)).pipe(res)
  })
}

/**
 * For writing non-segment or manifest files.
 * (e.g subtitles or json or any other file in the hls directory)
 */
function _writeGeneric (req, res, next, provider, segmentTransformation) {
  provider.getGenericStream(req, function (err, stream) {
    if (err) {
      return next(new Error(`Unable to retrieve file ${ req.filePath} - ${err}`))
    }

    res.setHeader('Content-Type', EXT_CONTENT_TYPE[req.extension] || 'text/plain')
    res.statusCode = 200
    stream.pipe(res)
  })
}
