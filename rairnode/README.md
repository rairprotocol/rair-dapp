# `decrypt-node`

> TODO: description

## Usage

```
const decryptNode = require('decrypt-node');

// TODO: DEMONSTRATE API
```

# `Docker Implementation -in progress

This will build the rair node, but IPFS will not be functioning locally, as additional configuration is necesary to communicate outside of the container.  This is currently observing an external IPFS cluster, as noted in the .env file.

docker build -t rairnode .

docker run -it --rm -p 5000:5000 -p 3000:3000 -p 5001:5001 -p 4001:4001 -p 8080:8080 rairnode

Optionally, use -d flag to run as a daemon

# Usage of the IPFS Service

For switching between different IPFS services have to be changed environment variable `IPFS_SERVICE`

Supported options:
 - **ipfs** - native IPFS service;
 - **pinata** - Pinata cloud;

# Usage admin NFT

Have to be set current value of `ADMIN_CONTRACT` variable in `.env` file 

# Redis

For correct work of Redis we have to set

`REDIS_HOST=rair-redis`

`REDIS_PORT=6379`

# Sessions

For correct work of sessions we need to set

`SESSION_SECRET` - any string

`SESSION_TTL` - number of hours (**default 12**)

# API

* [x] /api
    * [x] /transaction/:network/:hash - GET - Process the transaction hash given, [see details here](readme/get_transaction.md)
    * [x] /blockchains - GET - get blockchains list, [see details here](readme/get_blockchains.md)
    * [x] /categories - GET - get categories list, [see details here](readme/get_categories.md)
    * [x] /search - POST - searching by files, products, users, [see details here](readme/search.md)
    * [x] /stream/out - GET - terminating access for video streaming session, [see details here](readme/terminate_stream_session.md)
    * [x] /auth
        * [x] /get_challenge/:MetaAddress - GET - request an auth challenge for the given ethereum address, [see details here](readme/get_challenge.md)
        * [x] /get_token/:MetaMessage/:MetaSignature/:mediaId - GET - respond to a challenge to receive a JWT, [see details here](readme/get_token.md)
        * [x] /admin/:MetaMessage/:MetaSignature - GET - verify with a Metamask challenge if the user holds the current Administrator token, [see details here](readme/admin.md)
        * [x] /new_admin/:MetaMessage/:MetaSignature - POST - verify the user holds the current Admin token and then replace it with a new token, [see details here](readme/new_admin.md)
        * [x] /authentication/:MetaMessage/:MetaSignature - GET - verification of user Metamask challenge and generating of JWT token, [see details here](readme/get_jwt_token.md)
        * [x] /user_info - GET - get details about user by JWT token, [see details here](readme/get_user_details.md)
    * [x] /media
        * [x] /add/:mediaId - POST - register a new piece of media, [see details here](readme/add_media.md)
        * [x] /remove/:mediaId - DELETE - find and delete the media, [see details here](readme/remove_media.md)
        * [x] /list - GET - list all the registered media, their URIs and encrypted status, [see details here](readme/get_all_media.md)
        * [x] /upload - POST - upload the media, [see details here](readme/upload_media.md)
    * [x] /users - POST - create new user, [see details here](readme/create_user.md)
        * [x] /:publicAddress - GET - get single user, [see details here](readme/get_user.md)
        * [x] /:publicAddress - POST - update specific user, [see details here](readme/update_user.md)
    * [x] /contracts - GET - get list of contracts for specific user, [see details here](readme/get_contracts.md)
        * [x] /import/network/:networkId/:contractAddress/ - GET - Import the given contract's NFTs, [see details here](readme/get_external_contract.md)
        * [x] /network/:networkId
            * [x] /:contractAddress - GET - get specific contract, [see details here](readme/get_single_contract.md)
                * [x] /products - GET - get all products for specific contract, [see details here](readme/get_products_for_contract.md)
                    * [x] /offers - GET - get all products with all offers for each of them for particular user, [see details here](readme/get_products_offers.md)
        * [x] /full - GET - get list of all contracts with all products and offers, [see details here](readme/get_full_contracts.md)
        * [x] /singleContract/:contractId - GET- get single contract by ID, [see details here](readme/get_single_contract_by_id.md)
    * [x] /nft - POST - create new or update existed nft tokens, [see details here](readme/bulk_create_NFT_tokens.md)
        * [x] / - GET - get all tokens which belongs to current user, [see details here](readme/get_all_tokens_for_current_user.md)
        * [x] /csv/sample - GET - get CSV sample file, [see details here](readme/get_csv_sample_file.md)
        * [x] /network/:networkId/:contract
            * [x] /:product - GET - get tokens for the product, [see details here](readme/get_all_minted_tokens_from_product.md)
                * [x] /tokenNumbers - GET - Get list of token numbers, [see details here](readme/get_all_minted_token_numbers_from_product.md)
                * [x] /token/:token - GET - Get specific token by contract, product and internal ID, [see details here](readme/get_minted_token_by_contract_product_index.md)
                    * [x] / - POST - Update specific token metadata by contract, product and internal ID, [see details here](readme/update_token_metadata.md)
                    * [x] /pinning - GET - Pin token metadata to IPFS cloud, [see details here](readme/pin_token_metadata_to_ipfs.md)
                * [x] /files - GET - get files for specific product, [see details here](readme/get_files_by_product.md)
                    * [x] /:token - GET - get files by NFT token, [see details here](readme/get_files_by_nft.md)
                * [x] /offers - GET - get specific product with all offers, [see details here](readme/get_product_offers.md)
                * [x] /locks - GET - get all locks for specific product, [see details here](readme/get_product_locks.md)
            * [x] /token/:tokenInContract - GET - Get specific token by contract address and unique toke ID in contract, [see details here](readme/get_minted_token_by_contract_index.md)
    * [x] /docs - swagger documentation for the server
    * [x] /:contractId/:productIndex - GET - get full data about particular product and get list of tokens for it, [see details here](readme/get_token_metadata.md)
* [x] /stream/:token/:mediaId - POST - Register a new piece of media, [see details here](readme/stream.md)
* [x] /thumbnails - GET - get static files, [see details here](readme/thumbnails.md)


# MongoDB structure

![](readme/assets/rair_db.png)
