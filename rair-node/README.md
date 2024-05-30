![Banner](../rair-infra/assets/img/banner.webp)
[![RAIRmarket](https://img.shields.io/badge/RAIR-market-C67FD1)](https://rair.market)
[![RAIRprotocol](https://img.shields.io/badge/RAIR-protocol-C67FD1)](https://rairprotocol.org)
![License](https://img.shields.io/badge/License-Apache2.0-yellow)
[![Discord](https://img.shields.io/badge/Discord-4950AF)](https://discord.gg/vuBUfB7w)
[![Twitter](https://img.shields.io/twitter/follow/rairprotocol)](https://twitter.com/rairprotocol)

# RAIR backend

Main backend component for a RAIR system, mainly focused on API calls, small IPFS uploads and database queries.  
For the backend component in charge of processing blockchain data, see RAIRsync.  
For the backend component in charge of video uploading and processing, see RAIRstream.  

Reliant on Express, Mongoose and Alchemy for it's various functionalities.  

# Setup
Provide all necessary environment variables and then
```
    npm i && npm start
```
Alternatively you can use the provided Dockerfile to create an image. 
The benefits of using the Dockerfile are that it uses the latest OFAC list.

# Environment variables
| Name | Type| Description |
| --- | --- | --- |
| *_GATEWAY | String| Blockchain Explorer Gateway|
| *_RPC | String| RPC Endpoint |
| *_FACTORY_ADDRESS | String | 0xAddress |
| *_DIAMOND_FACTORY_ADDRESS | String| 0xAddress |
| *_DIAMOND_MARKETPLACE_ADDRESS | String| 0xAddress |
| *_MINTER_ADDRESS | String| 0xAddress |
| *_RESALE_ADDRESS | String| 0xAddress |
| *_CREDIT_ADDRESS | String| 0xAddress |
| *_GENERATE_MONGO_URI_WITH_VAULT_CREDENTIAL_UTIL | Boolean| Generate Database URI  |
| ADMIN_NFT_CHAIN | String| Admin blockchain |
| ADMIN_CONTRACT | String| 0xAddress |
| ALCHEMY_API_KEY| String | Required For Blockchain Sync |
| APP_NAME | String |  |
| AWS_ACCESS_KEY_ID | String | ID |
| AWS_SECRET_ACCESS_KEY | String | Secret |
| BASE_BCN_URL | String | Locate Blockchain-Networks service from Rairnode |
| BASE_RAIRNODE_URL | String | Locate Rairnode from Media-Service|
| DBUSER | String | Remote Mongo Username|
| DBPASS | String | Remote Mongo Password|
| DBHOST | String | Remote Mongo Hostname|
| DEFAULT_PRODUCT_COVER | String | Image URL for NFTs that have no metadata|
| FILEBASE_BUCKET | String | IPFS STORAGE  |
| GCP_PROJECT_ID | String | ID for a GCP project |
| GCP_IMAGE_BUCKET_NAME | String | For Image Storage |
| GCP_VIDEO_BUCKET_NAME | String | For Video Storage  |
| GCP_GATEWAY | String | Gateway to GCP storage API |
| GCP_CREDENTIALS | String | Private key for authenticating with GCP |
| HOSTNAME | String | Docker Container Hostname|
| INFURA_PROJECT_ID | String | (DEPRECIATED)|
| IPFS_SERVICE | String | Pinata or IPFS |
| IPFS_GATEWAY | String | URL |
| IPFS_API | String | URL |
| MONGO_URI | String | URI for database in production mode |
| MONGO_URI_LOCAL | String | URI for database in development mode |
| MONGO_DB_HOSTNAME | String | Database hostname |
| MONGO_DB_NAME | String | Database name |
| PINATA_KEY | String | (Deprecated) Piñata API key |
| PINATA_SECRET | String | (Deprecated) Piñata Secret |
| PINATA_GATEWAY | String | (Depreciated) Pinata Gateway |
| PRODUCTION | Boolean | Enable / disable production mode
| REDIS_HOST | String | Hostname |
| REDIS_PORT | Int | Port Number |
| SESSION_SECRET | String |  Sign user sessions to prevent tampering |
| SESSION_TTL | Int | Lifespan in Seconds |
| SENTRY_DSN | String |  |
| SENTRY_ENABLED | Boolean | T/F |
| SENTRY_ENDPOINT | String | URL|
| SENTRY_TRACE_RATE | Float | Rate |
| SENTRY_RELEASE | String | Build|
| SYNC_CONTRACT_REPEAT_EVERY |Int | Long-term Sync|
| SYNC_CONTRACT_TASK_INTERVAL| int| Long-term Sync|
| SUPER_ADMIN_VAULT_STORE | String | Vault data for Super Admin List |
| SERVICE_HOST | String | Service hostname |
| MEDIA_SERVICE_PORT | Int | Media-Service Port Number|
| MONGO_LOG_COLLECTION | String|  |
| LOCALDBUSER | String | Local Mongo Username|
| LOCALDBPASS | String | Local Mongo Password
| LOCALDBHOST | String | Local Mongo Hostname|
| LOG_LEVEL | Int | (0-6) Controls Log Verbosity |
| VAULT_URL | String | For connecting to remote Vault cluster |
| VAULT_*_APP_ROLE_ID | String | RoleID  |
| VAULT_*_APP_ROLE_SECRET_ID | String | SecretID |
| VAULT_*_USE_X509_CERT_AUTH | Boolean | For Passwordless Auth |
| WITHDRAWER_PRIVATE_KEY | String |  |
| YOTI_CLIENT_ID | String | ID |
| ZOOM_API_KEY | String | (DEPRECIATED) |
| ZOOM_API_SECRET | String | (DEPRECIATED) |

# API
* /api
    * /analytics
        * [x] /:mediaId - GET - Fetch analytics data for a media file ([details](readme/current/analytics/file_analytics.md))
        * [x] /:mediaId/csv - GET - Export analytics of a media file as a CSV file ([details](readme/current/analytics/file_analytics_csv.md))
    * /auth
        * [x] /get_challenge - POST - Generate signature challenge for web3 wallets ([details](readme/current/auth/auth_challenge.md))
        * [x] /login/ - POST - Verify the signed message from a web3 wallet ([details](readme/current/auth/auth_login.md))
        * [x] /loginSmartAccount - POST - Verify signed message from Alchemy Smart Account ([details](readme/current/auth/auth_login.md))
        * [x] /logout/ - GET - Close session from current user ([details](readme/current/auth/auth_logout.md))
        * [x] /me/ - GET - Get information of current user ([details](readme/current/auth/auth_current.md))
        * [x] /stream/out - GET - Stop decryption for current media file ([details](readme/current/auth/auth_streamout.md))
        * [x] /unlock/ - POST - Verify NFT ownership to unlock media file ([details](readme/current/auth/auth_unlock.md))
    * /credits
        * [x] /:blockchain/:tokenAddress - GET - Query balance in a specific blockchain and token ([details](readme/current/credits/credits_balance.md))
        * [x] /withdraw - POST - Withdraw tokens ([details](readme/current/credits/credits_withdraw.md))
    * /contracts
        * [x] / - GET - Get all contracts ([details](readme/current/contracts/contracts_get_all.md))
        * [x] /:id - GET - Get a specific contract ([details](readme/current/contracts/contracts_get_single.md))
        * [x] /:id - PATCH - Update the contract's display or syncing flags ([details](readme/current/contracts/contracts_update_single.md))
        * [x] /factoryList - GET - Summarized list of contracts for the factory ([details](readme/current/contracts/contracts_get_factory.md))
        * [x] /full - GET - Full contract list with information about products and offers ([details](readme/current/contracts/contracts_get_full.md))
        * [x] /import/ - POST - Import an external contract ([details](readme/current/contracts/contracts_import.md))
        * [x] /my - GET - Get all contracts deployed by the current user ([details](readme/current/contracts/contracts_get_user.md))
        * [x] /network/:networkId/:contractAddress - GET - Find a specific contract given a network and address ([details](readme/current/contracts/contracts_get_manual.md))
            * [x] /products - GET - List products from found contract ([details](readme/current/contracts/contracts_get_manual_products.md))
                * [x] /offers - GET - List products and offers from found contract ([details](readme/current/contracts/contracts_get_manual_offers.md))
    * [x] /favorites
        * [x] / - POST - Create a favorite token for the current user ([details](readme/current/favorites/favorites_create.md))
        * [x] / - GET - Get all favorited tokens by the current user ([details](readme/current/favorites/favorites_list.md))
        * [x] /:userAddress - GET - Get the favorites for a current user ([details](readme/current/favorites/favorites_user.md))
        * [x] /:id - DELETE - Delete a favorite ([details](readme/current/favorites/favorites_delete.md))
    * [x] /files
        * [x] /update/:mediaId - PATCH - Update general information about a file ([details](readme/current/files/files_update.md))
        * [x] /remove/:mediaId - DELETE - Delete and unpin a file ([details](readme/current/files/files_delete.md))
        * [x] /list - List all media files ([details](readme/current/files/files_list.md))
        * [x] /byId/:id - GET - Fetch information about a single file ([details](readme/current/files/files_get_id.md))
        * [x] /byId/:id - PUT - Update access information about a single file ([details](readme/current/files/files_update_id.md))
        * [x] /byCategory/:id - List all files under a specific category ([details](readme/current/files/files_category_search.md))
        * [x] /forToken/:id - List all files associated with a token ([details](readme/current/files/files_token_search.md))
        * [x] /categories - List all available categories ([details](readme/current/files/files_categories.md))
        * [x] /:id/unlocks - GET - Get all offers associated with a file ([details](readme/current/files/files_unlocks_get.md))
        * [x] /:id/unlocks - POST - Update offers associated with a file ([details](readme/current/files/files_unlocks_add.md))
        * [x] /:id/unlocks - DELETE - Remove an unlock from a file ([details](readme/current/files/files_unlocks_remove.md))
    * [x] /nft
        * [x] / - POST - Upload CSV file to populate metadata ([details](readme/current/nft/nft_upload_csv.md))
        * [x] / - GET - Get all tokens owned by the current user ([details](readme/current/nft/nft_get_current.md))
        * [x] /:userAddress - GET - Get tokens owned by a user ([details](readme/current/nft/nft_get_user.md))
        * [x] /csv/sample - GET - Download the sample CSV for metadata population ([details](readme/current/nft/nft_get_csv_sample.md))
        * [x] /pinningMultiple - POST - Pin all NFT metadata to the current IPFS service ([details](readme/current/nft/nft_pin_multiple.md))
        * [x] /network/:networkId/:contract/:product
            * [x] / - GET - Get the tokens in product ([details](readme/current/nft/nft_manual_product.md))
            * [x] /attributes - GET - Get all attributes from the NFTs in a product ([details](readme/current/nft/nft_manual_attributes.md))
            * [x] /files - GET - Get all files associated with the product ([details](readme/current/nft/nft_manual_files.md))
            * [x] /files/:token - GET - Get all files associated with a token in the product ([details](readme/current/nft/nft_manual_files_token.md))
            * [x] /offers - GET - Get the product data and the offers associated ([details](readme/current/nft/nft_manual_offers.md))
            * [x] /locks - GET - Get the offers with locks associated to the product ([details](readme/current/nft/nft_manual_locks.md))
            * [x] /token/:token
                * [x] / - GET - Get data of a single token ([details](readme/current/nft/nft_get_single_index.md))
                * [x] / - POST - Update the metadata for a single token ([details](readme/current/nft/nft_update_metadata.md))
                * [x] /pinning - POST - Pin the metadata of a single token ([details](readme/current/nft/nft_pin_metadata.md))
    * [x] /offers
        * [x] / - GET - Get all offers ([details](readme/current/offers/offers_list.md))
    * [x] /products
        * [x] / - GET - Get all products ([details](readme/current/products/products_list.md))
        * [x] /user/:userAddress - GET - Get all products from an user ([details](readme/current/products/products_user_list.md))
        * [x] /:id - GET - Get a single product's data ([details](readme/current/products/products_single.md))
        * [x] /:id - POST - Set the product's banner ([details](readme/current/products/products_set_banner.md))
    * [x] /resales
        * [x] /open - GET - List all open resale offers ([details](readme/current/resales/resales_open.md))
        * [x] /purchase/:id - GET - Purchase a resale offer ([details](readme/current/resales/resales_purchase.md))
        * [x] /create - POST - Create a resale offers ([details](readme/current/resales/resales_create.md))
        * [x] /update - PUT - Update a resale offer ([details](readme/current/resales/resales_update.md))
        * [x] /delete/:id - DELETE - Delete a resale offer ([details](readme/current/resales/resales_delete.md))
    * [x] /search
        * [x] /:textParam - GET - Get paginated result of text search ([details](readme/current/search/search_simple.md))
        * [x] /:textParam/all - GET - Get all results of text search ([details](readme/current/search/search_full.md))
    * [x] /settings
        * [x] / - GET - Get all settings ([details](readme/current/settings/settings_get.md))
        * [x] /theme - GET - Get all settings related to color and theme ([details](readme/current/settings/settings_get_theme.md))
        * [x] /featured - GET - Get featured collection ([details](readme/current/settings/settings_get_featured.md))
        * [x] /appLogo - POST - Upload custom logos ([details](readme/current/settings/settings_set_logos.md))
        * [x] / - POST - Set settings ([details](readme/current/settings/settings_set_settings.md))
        * [x] /:blockchain - PUT - Set settings for a specific blockchain ([details](readme/current/settings/settings_update_blockchain.md))
    * [x] /tokens
        * [x] / - GET - Search tokens ([details](readme/current/tokens/tokens_list.md))
        * [x] /id/:id - GET - Get data for a specific token ([details](readme/current/tokens/tokens_single.md))
        * [x] /tokenNumbers - GET - Get all tokens on a specific contract and offer ([details](readme/current/tokens/tokens_numbers.md))
        * [x] /:token - GET - Get information for a single token ([details](readme/current/tokens/tokens_single_number.md))
    * [x] /transaction/:network/:hash - POST - Process a blockchain transaction ([details](readme/current/transactions/transaction_hash.md))
    * [x] /users
        * [x] /list - GET - List all users ([details](readme/current/users/users_list.md))
        * [x] /export - GET - Export all users as a CSV file ([details](readme/current/users/users_export.md))
        * [x] /verify-age - POST - Use Yoti services to verify the user's age ([details](readme/current/users/users_yoti_check.md))
        * [x] / - Create user at login ([details](readme/current/users/users_create.md))
        * [x] /:publicAddress - GET - Get information from a single user ([details](readme/current/users/users_get.md))
        * [x] /:publicAddress - PATCH - Update user information ([details](readme/current/users/users_update.md))
    * [x] /upload
        * [x] /validate - GET - Validate information for the media file ([details](readme/current/upload/upload_validate.md))
        * [x] /file - POST - Insert a media file in the database ([details](readme/current/upload/upload_file.md))
    * [x] /notifications
        * [x] / - GET - List of notifications ([details](readme/current/notifications/get_list.md))
        * [x] /:id - GET - Get a single notification ([details](readme/current/notifications/get_single.md))
        * [x] /:id - PUT - Mark a notification as read ([details](readme/current/notifications/mark_read.md))
        * [x] /:id - DELETE - Delete a notification ([details](readme/current/notifications/delete.md))

# Contributors
Valerii Kovalov \
Micahel Bielikov \
Yehor Boromazov \
Dima \
Juan Sanchez \

# License
Apache 2.0 license
