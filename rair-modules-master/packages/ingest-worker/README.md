# `@rair/ingest-worker`

A WebWorker for encoding and encryption

## Usage

In a browser hosted javascript file it is a simple as creating a worker and sending it messages to start execution.

Ensure `ingest-worker.js` is hosted on the webserver as it will be automatically requested by the browser in the worker constructor.

The worker 

The worker responds to messages of the form:
`{type: 'run', data: { fileData, format, aesKey? }}`

- The fileData should be an ArrayBuffer or Uint8Array containg the binary file data
- The format is a string (e.g. 'mp4') containing a hint to the file source encoding
- aesKey is optional and is a standard browser [CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey) for AES-128-CBC encryption that has the `encrypt` usage set.

e.g.
```javascript
const aesKey = await window.crypto.subtle.generateKey(
  {
    name: "AES-CBC",
    length: 128
  },
  true,
  ["encrypt"]
);
``` 

## Example

```javascript
// requests the worker script and starts the worker
const worker = new Worker('ingest-worker.js')

// handler for any messages the worker triggers
const msg = e.data;
worker.onmessage = function(e) { 
  switch (msg.type) {
	  case "ready":
	  	// when it is ready send a message back instructing it to encode a file
	  	// The fileData should be an ArrayBuffer or Uint8Array containg the binary file data
	    worker.postMessage({type: "run", data: { file: fileData, format: 'mp4', aesKey }});
	    break;
	  case "stdout":
	    console.log(msg.data);
	    break;
	  case "stderr":
	    console.log(msg.data);
	    break;
	  case "done":
	  	// encoding is complete!
	  	// do something with msg.data
	    break;
  }
};
```
