# Search through all tokens

**URL** : `/api/tokens/`
**Method** : `GET`

**Query Parameters**
```json
{
    "token": { "required": false, "content": { "type": "string" } },
    "uniqueIndexInContract": { "required": false, "content": { "type": "string" } },
    "ownerAddress": { "required": false, "content": { "type": "string" } },
    "offerPool": { "required": false, "content": { "type": "string" } },
    "offer": { "required": false, "content": { "type": "string" } },
    "contract": { "required": true, "content": { "type": "string" } },
    "metadataURI": { "required": false, "content": { "type": "string" } },
    "authenticityLink": { "required": false, "content": { "type": "string" } },
    "isMinted": { "required": false, "content": { "type": "boolean" } },
    "isMetadataPinned": { "required": false, "content": { "type": "string" } },
    "isURIStoredToBlockchain": { "required": false, "content": { "type": "string" } },
    "creationDate": { "required": false, "content": { "type": "string" } },
    "product": { "required": false, "content": { "type": "string" } },
    
    "pageNum": { "required": false, "content": { "type": "number" } },
    "itemsPerPage": { "required": false, "content": { "type": "number" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "results": 8,
    "tokens": [
        {
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
        },
        {
            "_id": "64ff47da57d24b6bb5e7335b",
            "token": "1",
            "uniqueIndexInContract": "1",
            "ownerAddress": "0x0000000000000000000000000000000000000000",
            "offer": "0",
            "contract": "64ff440357d24b6bb5e67302",
            "metadataURI": "none",
            "authenticityLink": "none",
            "isMinted": false,
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
        },
        {
            "_id": "64ff47da57d24b6bb5e73364",
            "token": "2",
            "uniqueIndexInContract": "2",
            "ownerAddress": "0x0000000000000000000000000000000000000000",
            "offer": "1",
            "contract": "64ff440357d24b6bb5e67302",
            "metadataURI": "none",
            "authenticityLink": "none",
            "isMinted": false,
            "isURIStoredToBlockchain": false,
            "metadata": {
                "image": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
                "artist": "none",
                "external_url": "none",
                "description": "none",
                "name": "none",
                "attributes": []
            },
            "creationDate": "2023-09-11T17:01:14.688Z"
        }
    ]
}
```