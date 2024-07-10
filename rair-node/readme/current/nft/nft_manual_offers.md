# Get the offers inside a product
Search using network and address

**URL** : `/api/nft/network/:network/:contractAddress/:product/offers`
**Method** : `GET`

**Parameters**
```json
{
    "network": { "required": true, "content": { "type": "string" } },
    "contractAddress": { "required": true, "content": { "type": "string" } },
    "product": { "required": true, "content": { "type": "string" } },
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
        "_id": "654144b3a83090be43bccd7c",
        "name": "138",
        "collectionIndexInContract": "0",
        "contract": "6541442aa83090be43bccd74",
        "copies": 1000,
        "soldCopies": 2,
        "sold": false,
        "royalty": 0,
        "firstTokenIndex": "0",
        "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
        "transactionHash": "0x0a6d3963fe7879576594f326dd6b19fad66bf85bbcb77533a3b861a3a4d27d6c",
        "diamond": true,
        "singleMetadata": false,
        "metadataURI": "none",
        "creationDate": "2023-10-31T18:17:23.202Z",
        "offers": [
            {
                "_id": "65414514a83090be43bccd85",
                "contract": "6541442aa83090be43bccd74",
                "product": "0",
                "copies": 10,
                "allowedCopies": 10,
                "lockedCopies": 0,
                "soldCopies": 2,
                "sold": false,
                "price": "100000000000000000",
                "range": [
                    "0",
                    "9"
                ],
                "offerName": "Deluxe",
                "diamond": true,
                "diamondRangeIndex": "0",
                "transactionHash": "0x77d759aa37dcba57f44d48580957cf36a599c15cc478f18af8b7be575e8de68d",
                "hidden": false,
                "creationDate": "2023-10-31T18:19:00.610Z",
                "offerIndex": "69"
            }
        ],
        "owner": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3"
    }
}
```

**Condition** : Contract or Product not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Data not found" }
```