# Get all NFTs from a user

**URL** : `/api/nft/:userAddress`
**Method** : `GET`

**Parameters**
```json
{ "userAddress": { "required": true, "content": { "type":  } } }
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "result": [
        {
            "_id": "64ff40c357d24b6bb5e453df",
            "token": "0",
            "uniqueIndexInContract": "0",
            "ownerAddress": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "offer": "0",
            "contract": "64ff3f5e57d24b6bb5e45090",
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
            "creationDate": "2023-09-11T16:30:59.703Z"
        },
        {
            "_id": "64ff40c357d24b6bb5e453e0",
            "token": "1",
            "uniqueIndexInContract": "1",
            "ownerAddress": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "offer": "0",
            "contract": "64ff3f5e57d24b6bb5e45090",
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
            "creationDate": "2023-09-11T16:30:59.703Z"
        },
        {
            "_id": "64ff40c357d24b6bb5e453e4",
            "token": "5",
            "uniqueIndexInContract": "5",
            "ownerAddress": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "offer": "0",
            "contract": "64ff3f5e57d24b6bb5e45090",
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
            "creationDate": "2023-09-11T16:30:59.704Z"
        },
    ],
    "totalCount": 101
}
```
