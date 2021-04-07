# `decrypt-node`

> TODO: description

## Usage

```
const decryptNode = require('decrypt-node');

// TODO: DEMONSTRATE API
```

# `Docker Implementation -in progress

This will build the rair node, but IPFS will not be functioning properly, as additional configuration is necesary to communicate outside of the container.

docker build -t rairnode .
docker -it -p 5000:5000 rairnode