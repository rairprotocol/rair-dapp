/* eslint-disable no-param-reassign */
const url = require('url');
const path = require('path');
const zlib = require('zlib');
const { PassThrough } = require('stream');
const httpProvider = require('./httpProvider');
const log = require('../logger')(module);

const CONTENT_TYPE = {
  MANIFEST: 'application/vnd.apple.mpegurl',
  SEGMENT: 'video/MP2T',
  HTML: 'text/html',
};

const EXT_CONTENT_TYPE = {
  '.vtt': 'text/plain', // HLS subtitles file
  '.json': 'application/json',
};
function _writeManifest(req, res, next, provider) {
  provider.getManifestStream(req, (err, stream) => {
    try {
      if (err) {
        throw new Error(`Unable to retrieve manifest ${req.filePath} - ${err}`);
      }

      res.setHeader('Content-Type', CONTENT_TYPE.MANIFEST);
      res.statusCode = 200;

      if (req.acceptsCompression) {
        res.setHeader('content-encoding', 'gzip');
        res.statusCode = 200;
        const gzip = zlib.createGzip();
        stream.pipe(gzip).pipe(res);
      } else {
        stream.pipe(res, 'utf-8');
      }
    } catch (error) {
      return error;
    }
  });
}

function _writeSegment(req, res, next, provider, segmentTransformation) {
  provider.getSegmentStream(req, (err, stream) => {
    try {
      if (err) {
        throw new Error(`Unable to retrieve segment ${req.filePath} - ${err}`);
      }

      res.setHeader('Content-Type', CONTENT_TYPE.SEGMENT);
      res.statusCode = 200;
      stream.pipe(segmentTransformation(req)).pipe(res);
    } catch (error) {
      return error;
    }
  });
}

/**
 * For writing non-segment or manifest files.
 * (e.g subtitles or json or any other file in the hls directory)
 */
function _writeGeneric(req, res, next, provider) {
  provider.getGenericStream(req, (err, stream) => {
    try {
      if (err) {
        throw new Error(`Unable to retrieve file ${req.filePath} - ${err}`);
      }

      res.setHeader(
        'Content-Type',
        EXT_CONTENT_TYPE[req.extension] || 'text/plain',
      );
      res.statusCode = 200;
      stream.pipe(res);
    } catch (error) {
      return error;
    }
  });
}
module.exports = (opts) => {
  opts = opts || {};
  const { mediaConfigStore } = opts;
  const segmentTransformation =
    opts.segmentTransformation || (() => new PassThrough());
  const authCallback = opts.authCallback || (() => true);

  const hlsServer = {};

  hlsServer.middleware = async (req, res, next) => {
    try {
      const { mediaId } = req.params;
      const filePath = url.parse(req.url).pathname;
      const extension = path.extname(filePath);

      log.info('request for media', mediaId, filePath);

      const mediaConfig = await mediaConfigStore(mediaId);
      if (mediaConfig === undefined) {
        // the request is for unrecognised media
        throw new Error('No config exists for given media');
      }

      const proxyUri = mediaConfig.uri;

      req.proxyUrl = proxyUri + filePath;
      req.mediaId = mediaId;
      req.mediaConfig = mediaConfig;
      req.filePath = filePath;
      req.extension = extension;

      if (!authCallback(req)) {
        throw new Error('Caller is not authorized to view media');
      }

      // Gzip support
      const ae = req.headers['accept-encoding'] || '';
      req.acceptsCompression = ae.match(/\bgzip\b/);

      httpProvider.exists(req, (err, exists) => {
        if (err) {
          res.statusCode = 500;
          res.end();
        } else if (!exists) {
          res.statusCode = 404;
          res.end();
        } else {
          switch (extension) {
            case '.m3u8':
              log.info('retrieving manifest', req.fsPath || req.proxyUrl);
              _writeManifest(req, res, next, httpProvider);
              break;
            case '.ts':
              log.info('retrieving segment', req.fsPath || req.proxyUrl);
              _writeSegment(
                req,
                res,
                next,
                httpProvider,
                segmentTransformation,
              );
              break;
            default:
              log.info('retrieving file', req.fsPath || req.proxyUrl);
              _writeGeneric(req, res, next, httpProvider);
              break;
          }
        }
      });
    } catch (e) {
      return next(e);
    }
  };

  return hlsServer;
};
