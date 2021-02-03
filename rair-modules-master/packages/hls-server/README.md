# hls-server

Simple HTTP middleware for serving HTTP Live Streaming (HLS) compatible media streams.  

Forked from t-mullen to support streaming AES decryption in a non-standard way.

## Usage
First you need a compatible media stream (see @rair/ingest).

In this fork media must be explicitly configured in the `mediaConfig` option. This maps between route paths (excluding the basename) and configuration objects. Commonly this would contain a `dir` field to tell the fs provider where to find the files for that piece of media. This decouples the file system structure from the server and allows non-fs providers to receive free form config.

Detailed way:
```javascript
var HLSServer = require('hls-server')
var express = require('express')

const app = express()

var hls = HLSServer({
  mediaConfig: {
    'sample_vid': {
      dir: '/home/user/media/sampleVid/',
      keyPath: '/home/user/media/sampleVid/aes.key' // may also have other fields that are available to the provider and transformation callbacks
    }
  }
})

app.use('/stream', hls.middleware)
app.listen(8000)
```

### Adding a stream decrypter

The `HLSServer` constructor accepts an optional parameter `opts.segmentTransformation`. If provided this must be a function that accepts the `req` object and returns a stream which can be used to transform a single segment. Only media segments (e.g. `.ts`) files will be piped to the transformation. Manifests will be passed through as is. This can be used to do streaming decryption server side.

The `req` object can be used to set a unique key and IV per segment/media stream.

Example using AES decryption where all streams share a key and IV (don't actually do this):
```js
const crypto = require('crypto')
const key = ///
const iv = ///
const segmentTransformation = req => {
  return crypto.createDecipheriv('aes-128-cbc', key, iv)
}
var hls = HLSServer({
  path: '/streams',     // Base URI to output HLS streams
  dir: 'public/videos'  // Directory that input files are stored
  segmentTransformation
})

app.use('/stream', hls.middleware)
app.listen(8000)
```

## Using In-Memory Streams
By default, this module assumes files are kept in a directory on the local filesystem. If you want to stream files from another source (or don't want to relate URL paths to filesystem paths), you can specify a provider in the options like so:

```javascript
var hls = HLSServer({
  provider: {
    exists: function (req, callback) { // check if a file exists (always called before the below methods)
      callback(null, true)                 // File exists and is ready to start streaming
      callback(new Error("Server Error!")) // 500 error
      callback(null, false)                // 404 error
    },
    getManifestStream: function (req, callback) { // return the correct .m3u8 file
      // "req" is the http request
      // "callback" must be called with error-first arguments
      callback(null, myNodeStream)
      // or
      callback(new Error("Server error!"), null)
    },
    getSegmentStream: function (req, callback) { // return the correct .ts file
      callback(null, myNodeStream)
    }
  }
})
```

See `src/fsProvider.js` for the default provider using the local filesystem.

