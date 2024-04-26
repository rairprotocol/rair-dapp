# Get products given a blockchain and address

**URL** : `/api/contracts/network/:networkId/:contractAddress/products`
**Method** : `GET`

**Parameters:**
```json
{
    "networkId": { "type": "string", "required": true },
    "contractAddress": { "type": "string", "required": true },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "products": [
        {
            "_id": "64ff3f7757d24b6bb5e451d6",
            "name": "product-1_suresh-Matic_2403",
            "collectionIndexInContract": "0",
            "contract": "64ff3f5757d24b6bb5e45009",
            "copies": 100,
            "soldCopies": 0,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "0",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0xd56d31b4a7d278d7d18ab3f8b00e28f3e19f484afeb2f7fe4e027bda3b797b8f",
            "diamond": false,
            "singleMetadata": false,
            "metadataURI": "https://rair.mypinata.cloud/ipfs/QmcKFLdZHvEnKmqTt6iFWothZQDvq7VZDgYeJ4Jqt79Jsm",
            "creationDate": "2023-09-11T16:25:27.265Z"
        },
        {
            "_id": "64ff3f8057d24b6bb5e45214",
            "name": "product-01042022_142048",
            "collectionIndexInContract": "1",
            "contract": "64ff3f5757d24b6bb5e45009",
            "copies": 501,
            "soldCopies": 0,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "100",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0x943fea367553f9cbe8b41269fb6a0490f21fdf74e22610408a1015fa0fe88114",
            "diamond": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "creationDate": "2023-09-11T16:25:36.752Z"
        },
    ]
}
```

**Condition** : Contract not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Contract not found" }
```