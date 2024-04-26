# Get data for a single token
Using numerical values instead of IDs

**URL** : `/api/tokens/:number`
**Method** : `GET`

**Parameters**
```json
{
    "number": { "required": true, "content": { "type": "string" } },
}
```
**Query Parameters**
```json
{
    "contract": { "required": true, "content": { "type": "string" } },
    "product": { "required": true, "content": { "type": "string" } },
    "offerPool": { "required": true, "content": { "type": "string" } },
    "offers": { "required": true, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "data": {
        "doc": {
            "_id": "64ff47da57d24b6bb5e7335a",
            "token": "0",
            "uniqueIndexInContract": "0",
            "ownerAddress": "0xa409a6b5f68275cdbb56634f52f07e12c7cb58f5",
            "offer": "0",
            "contract": "64ff440357d24b6bb5e67302",
            "metadataURI": "none",
            "authenticityLink": "none",
            "isMinted": true,
            "isURIStoredToBlockchain": false,
            "metadata": {
                "image": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
                "artist": "none",
                "external_url": "none",
                "description": "none",
                "name": "none",
                "attributes": []
            },
            "creationDate": "2023-09-11T17:01:14.679Z"
        }
    }
}
```