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

# Sentry

Logs to Sentry will collect only for Production environment

`PRODUCTION` - has to be "true"

`SENTRY_DSN` - should be provided Sentry Data Source Name

# Super Admin rights

Provide ability to make some specific actions on the platform

`SUPER_ADMIN_VAULT_STORE` - key of the list of user public addresses on the Vault storage


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
        * [x] /pinningMultiple - POST - upload multiple tokens metadata to the cloud, [see details here](readme/upload_multiple_tokens_metadata_to_cloud.md)
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
  * [x] /v2
      * [x] /search - NULL
          * [x] /:textParam - GET - returns top 4 results of search among tokens, products and authors with text params [see details here](readme/search_v2.md)
          * [x] /:textParam/all - GET - NOT FOR PROD work in progress - returns all results of search among tokens, products and authors with text params
      * [x] /contracts - Return all Contracts (Query string supported) [see details here](readme/get_all.md)
          * [x] /my - get contracts for curent user [see details here](readme/get_contracts_my.md).
          * [x] /full - GET - get list of all contracts with all products and offers, [see details here](readme/get_full_contracts.md)
          * [x] /:id - return one found by ID [see details here](readme/common_get_by_id.md)
          * [x] /byUser/:userId - get list of conract for user based on user address [see details here](readme/get_contracts_by_userId.md)
      * [x] /products - Return all Products (Query string supported) [see details here](readme/common_get_all.md)
          * [x] /:productId - return one found by ID [see details here](readme\get_product_by_id)
          * [x] /user/:userAddress - return one found by user adress (adresses are stored in contract) (Query string supported) [see details here](readme\get_products_by_user_adress)
      * [x] /upload/file - POST- create file with media data si database [see details here](readme/add_file_after_upload_media.md)
      * [x] /upload/validate - GET - get validate data for upload video [see details here](readme/get_validate_data_for_upload.md)
      * [x] /verify - GET - return  verify User with rightAdmin for uploading media [see details here](readme/get_verify_user_for_upload_media.md)
          * [x] /:productId - return one found by ID [see details here](readme/get_product_by_id.md)
          * [x] /user/:userAddress - return one found by user adress (adresses are stored in contract) (Query string supported) [see details here](readme/get_products_by_user_adress.md)
      * [x] /offers - Return all Offers (Query string supported) [see details here](readme/common_get_all.md)
          * [x] /:id - return one found by ID [see details here](readme/common_get_by_id.md)
      * [x] /tokens - POST - create a batch of tokens with common metadata for contract or product, [see details here](readme/create_tokens_with_common_metadata.md)
          * [x] /favorite - POST - store favorite token for current user, [see details here](readme/create_favoriteToken.md)
          * [x] /favorite - GET - get list of favorites token for current user, [see details here](readme/get_list_of_favoriteTokens.md)
              * [x] /:id - DELETE - remove favorite token for current user, [see details here](readme/delete_favoriteToken.md)
      * [x] /resales - Return all ResalesTokenOffers (Query string supported) [see details here](readme/get_list_of_favoriteTokens.md)
          * [x] /:id - return one found by ID [see details here](readme/common_get_by_id.md)
          * [x] /customRoyalties - Return all customRoyaltiesSets (Query string supported) [see details here](readme/common_get_all.md)
          * [x] /byProduct/:productId - Return all ResalesTokenOffers for provided Product Id [see details here](readme/get_resales_by_Product.md)
          * [x] /byOffer/:offerId - Return all ResalesTokenOffers for provided Offer Id [see details here](readme/get_resales_by_Offer.md)
* [x] /stream/:token/:mediaId - POST - Register a new piece of media, [see details here](readme/stream.md)
* [x] /thumbnails - GET - get static files, [see details here](readme/thumbnails.md)

# MongoDB structure

![](readme/assets/rair_db.png)
