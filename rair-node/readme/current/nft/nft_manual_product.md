# Get the list of tokens inside a product
Search using network and address

**URL** : `/api/nft/network/:network/:contractAddress/:product`
**Method** : `GET`

**Parameters**
```json
{
    "network": { "required": true, "content": { "type": "string" } },
    "contractAddress": { "required": true, "content": { "type": "string" } },
    "product": { "required": true, "content": { "type": "string" } },

    "fromToken": { "required": false, "content": { "type": "string" } },
    "toToken": { "required": false, "content": { "type": "string" } },
    "limit": { "required": false, "content": { "type": "number" } },
    "forSale": { "required": false, "content": { "type": "boolean" } },
    "priceFrom": { "required": false, "content": { "type": "number" } },
    "priceTo": { "required": false, "content": { "type": "number" } },
    "filterConditions": { "required": false, "content": { "type": "string" } },
    "sortByPrice": { "required": false, "content": { "type": "number" } },
    "sortByToken": { "required": false, "content": { "type": "number" } },

    "onResale": { "required": false, "content": { "type": "boolean" } },

    "metadataFilters": { "required": false, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "result": {
        "totalCount": 9,
        "tokens": [
            {
                "_id": "64ff477957d24b6bb5e72bb0",
                "token": "0",
                "uniqueIndexInContract": "0",
                "ownerAddress": "0x0082c81367f9084fc3cc2400c3826dafac2516bb",
                "offer": {
                    "_id": "64ff477957d24b6bb5e72bad",
                    "contract": "64ff440357d24b6bb5e672da",
                    "product": "0",
                    "copies": 3,
                    "allowedCopies": 3,
                    "lockedCopies": 3,
                    "soldCopies": 2,
                    "sold": false,
                    "price": "250",
                    "range": [
                        "0",
                        "2"
                    ],
                    "offerName": "3010newRange1",
                    "diamond": true,
                    "diamondRangeIndex": "0",
                    "transactionHash": "0xe06560f2cafe81cc75caf7b0c8176902e0ac328160b6a00dd381d662227f272e",
                    "hidden": false,
                    "creationDate": "2023-09-11T16:59:37.874Z",
                    "offerIndex": "75"
                },
                "contract": "64ff440357d24b6bb5e672da",
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
                "creationDate": "2023-09-11T16:59:37.876Z"
            },
            {
                "_id": "64ff477957d24b6bb5e72bb1",
                "token": "1",
                "uniqueIndexInContract": "1",
                "ownerAddress": "0x0000000000000000000000000000000000000000",
                "offer": {
                    "_id": "64ff477957d24b6bb5e72bad",
                    "contract": "64ff440357d24b6bb5e672da",
                    "product": "0",
                    "copies": 3,
                    "allowedCopies": 3,
                    "lockedCopies": 3,
                    "soldCopies": 2,
                    "sold": false,
                    "price": "250",
                    "range": [
                        "0",
                        "2"
                    ],
                    "offerName": "3010newRange1",
                    "diamond": true,
                    "diamondRangeIndex": "0",
                    "transactionHash": "0xe06560f2cafe81cc75caf7b0c8176902e0ac328160b6a00dd381d662227f272e",
                    "hidden": false,
                    "creationDate": "2023-09-11T16:59:37.874Z",
                    "offerIndex": "75"
                },
                "contract": "64ff440357d24b6bb5e672da",
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
                "creationDate": "2023-09-11T16:59:37.876Z"
            }
        ]
    }
}
```

**Condition** : Contract or Product not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Data not found" }
```