# Get the offers with locked tokens inside a product
Search using network and address

**URL** : `/api/nft/network/:network/:contractAddress/:product/locks`
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
    "locks": [
        {
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
        {
            "_id": "64ff477957d24b6bb5e72bb9",
            "contract": "64ff440357d24b6bb5e672da",
            "product": "0",
            "copies": 3,
            "allowedCopies": 3,
            "lockedCopies": 3,
            "soldCopies": 0,
            "sold": false,
            "price": "1500",
            "range": [
                "3",
                "5"
            ],
            "offerName": "3010newRange2",
            "diamond": true,
            "diamondRangeIndex": "1",
            "transactionHash": "0xe06560f2cafe81cc75caf7b0c8176902e0ac328160b6a00dd381d662227f272e",
            "hidden": false,
            "creationDate": "2023-09-11T16:59:37.883Z",
            "offerIndex": "76"
        },
        {
            "_id": "64ff477957d24b6bb5e72bc5",
            "contract": "64ff440357d24b6bb5e672da",
            "product": "0",
            "copies": 3,
            "allowedCopies": 3,
            "lockedCopies": 3,
            "soldCopies": 2,
            "sold": false,
            "price": "350",
            "range": [
                "6",
                "8"
            ],
            "offerName": "3010newRange3",
            "diamond": true,
            "diamondRangeIndex": "2",
            "transactionHash": "0xe06560f2cafe81cc75caf7b0c8176902e0ac328160b6a00dd381d662227f272e",
            "hidden": false,
            "creationDate": "2023-09-11T16:59:37.894Z",
            "offerIndex": "77"
        }
    ]
}
```

**Condition** : Contract or Product not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Data not found" }
```
**Condition** : There are no offers with locked tokens
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "No locks found" }
```