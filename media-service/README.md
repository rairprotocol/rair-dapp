# `decrypt-node`

# Description

This microservice implements the process of downloading media. 
Media service does not have direct access to DB.
Validation of input and auth stay on rair-node side.
For service communication use axios request.
Status of upload should be visible (use socket).

## Usage

```
const decryptNode = require('decrypt-node');

// TODO: DEMONSTRATE API
```

# `Docker Implementation -in progress

This will build the rair node, but IPFS will not be functioning locally, as additional configuration is necesary to communicate outside of the container.  This is currently observing an external IPFS cluster, as noted in the .env file.

docker build -t media-service .

docker run -it --rm -p 5000:5000 -p 3000:3000 -p 5001:5001 -p 4001:4001 -p 8080:8080 rairnode

Optionally, use -d flag to run as a daemon


# Usage admin NFT

Have to be set current value of `ADMIN_CONTRACT` variable in `.env` file 


# Sessions

For correct work of sessions we need to set

`SESSION_SECRET` - any string

`SESSION_TTL` - number of hours (**default 12**)


# Sentry

Logs to Sentry will collect only for Production environment

`PRODUCTION` - has to be "true"

`SENTRY_DSN` - should be provided Sentry Data Source Name

# API

* [x] /api
    * [x] /v1
      * [x] /media/upload - POST - Upload the media, [see details here](readme/upload_media.md)
    

