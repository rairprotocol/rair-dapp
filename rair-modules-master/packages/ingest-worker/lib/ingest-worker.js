'use strict';

const { encodeHLS, encryptBrowser } = require('@rair/ingest')

let isRunning = false;

self.onmessage = async function(e) {
  let { type, data: { file, format, aesKey } } = e.data;
  if (type == "run") {
    if (isRunning) {
      self.postMessage({"type": "error", "data": "already running"});
    } else {
      isRunning = true;
      self.postMessage({"type": "run"});
      
      const handlers = {
        print: function(line) {
          self.postMessage({"type": "stdout", "data": line});
        },
        printErr: function(line) {
          self.postMessage({"type": "stderr", "data": line});
        },
        onExit: function(code) {
          self.postMessage({"type": "exit", "data": code});
        },
        onAbort: function(reason) {
          self.postMessage({"type": "abort", "data": reason});
        }
      }
      let result = encodeHLS(file, format, handlers)
      console.log(result)
      if (aesKey) {
        console.log('encrypting...')
        result = await encryptBrowser(result, aesKey)
        console.log(result)
      }
      // this ensures the data result is transferred rather than copied
      let transfer = result.map(function(f) {
        return f["data"].buffer;
      });
      self.postMessage({"type": "done", "data": result}, transfer);
      isRunning = false;
    }
  } else {
    self.postMessage({"type": "error", "data": "unknown command"});
  }
};

self.postMessage({"type": "ready"});
