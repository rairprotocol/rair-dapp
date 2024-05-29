# Get data for a single product

**URL** : `/api/products/:id`
**Method** : `GET`

**Parameters**
```json
{
    "id": { "required": false, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "product": {
        "_id": "64ff402657d24b6bb5e45329",
        "name": "Test Matic Collection 2",
        "collectionIndexInContract": "1",
        "contract": "64ff3f5757d24b6bb5e4502a",
        "copies": 50,
        "soldCopies": 0,
        "sold": false,
        "royalty": 0,
        "firstTokenIndex": "25",
        "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
        "transactionHash": "0x71c843b1a03c80b87c10e1c1254df241e8468dbec3749d7e1a430327e3a32fc9",
        "diamond": false,
        "singleMetadata": false,
        "metadataURI": "none",
        "creationDate": "2023-09-11T16:28:22.350Z"
    }
}
```