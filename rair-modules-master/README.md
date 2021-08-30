# RAIR Modules

A monorepo of dependent javascript modules for the Rair project.

This repo uses [lerna.js](https://github.com/lerna/lerna#about) to manage multiple modules within a single repo.

To initialize:
```shell
npm install
npm run bootstrap
```

## Demo

A demo web page of the ingestion process. Allows the user to upload a file, encode, optionally encrypt and download the encoded file and encryption key.

To run the demo:

```shell
npm run build:demo
cd demo
npm install
npm run serve
```

## `@rair/ingest`

Includes a wasm compiled verion of ffmpeg for converting (almost) any video file type to HLS. Also includes functions for encryption and writing manifest files.

Works in node.js and browser.

## `@rair/ingest-worker`

A web worker wrapper for the above. Allows hand off computationally intensive tasks like encoding to a seperate browser process so as not to slow down the main process. This is the reccomended way to encode files browser side.

## `@rair/hls-server`

Middleware for adding an HLS server to an express web server. Uses streams and can optionally add streaming decryption, dynamically manage multiple file streams from different types of sources (file and url).

## `@rair/eth-auth`

Express middleware for authenticating via Ethereum private key. The server dispatches a challenge which the client must sign with their private key this verifying their ownership of a particular account. 
