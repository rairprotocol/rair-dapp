# `@rair/ingest`

A javascript module for handling the common file ingestion tasks for Rair. This includes transcoding, chunking and encryption.

## Examples

```javascript

````

## API

Exports a single object with the following functions:

### `ingest.encodeHLS(input, format='mp4', handlers = { print: () => {}, printErr: () => {}, onExit: () => {} })`

A sync operation. Calls into ffmpeg to convert video files to the approved RAIR encoding.

Accepts as input a binary file in any form that can be converted into a Uint8Array (e.g. typed array, buffer, arrayBuffer).

Optionally takes a format hint

Optionally takes a handlers object with closures to handle when the code prints, errors or exits.

Returns an array of named files. This includes the manifests and chunks for HLS streaming. e.g.
```js
[{ name: 'master.m3u8', data: Uint8Array },
{ name: 'segment_001.ts', data: Uint8Array }, ...]
```

```javascript
const file = document.getElementById('fileupload').files[0];
const fileData = await file.arrayBuffer()
let result = ingest.encodeHLS(fileData, 'mp4')
```

### `async ingest.encryptBrowser(hlsData, key)`

Encrypts the chunk files given an AES key.

Accepts hlsData which is an array of files as `{name, data}` objects identical to the result of `encodeHLS`.

Accepts a AES encryption key. This is a standard browser [CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey) for AES-128-CBC encryption that has the `encrypt` usage set.

Returns a promise that resolves to a list of files where the `.ts` files are encrypted with the provided key.

```javascript
const key = await window.crypto.subtle.generateKey(
  {
    name: "AES-CBC",
    length: 128
  },
  true,
  ["encrypt"]
);
let result = ingest.encodeHLS(fileData, 'mp4')
const encryptedResult = await ingest.encryptBrowser(result, key)
```

### `async ingest.bundleAsZip(hlsData)`

Bundle up a list of files into a zip. Accepts the same format as the result of encodeHLS and return a blob which contains a binary zip file.

```javascript
let result = ingest.encodeHLS(fileData, 'mp4')
const zipBlob = await ingest.bundleAsZip(result)
// the zip blob can then be handed to the user file system
```