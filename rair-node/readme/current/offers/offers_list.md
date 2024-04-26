# Search through all offers

**URL** : `/api/offers/`
**Method** : `GET`

**Query Parameters**
```json
{
    "offerIndex": { "required": false, "content": { "type": "string" } },
    "contract": { "required": false, "content": { "type": "string" } },
    "product": { "required": false, "content": { "type": "string" } },
    "offerPool": { "required": false, "content": { "type": "string" } },
    "copies": { "required": false, "content": { "type": "string" } },
    "soldCopies": { "required": false, "content": { "type": "string" } },
    "sold": { "required": false, "content": { "type": "string" } },
    "price": { "required": false, "content": { "type": "string" } },
    "range": { "required": false, "content": { "type": "string" } },
    "offerName": { "required": false, "content": { "type": "string" } },
    "creationDate": { "required": false, "content": { "type": "string" } },
    "diamond": { "required": false, "content": { "type": "boolean" } },
    "diamondRangeIndex": { "required": false, "content": { "type": "string" } },
    "transactionHash": { "required": false, "content": { "type": "string" } },
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
    "results": 36,
    "data": {
        "doc": [
            {
                "_id": "64ff413657d24b6bb5e45732",
                "contract": "64ff3f5e57d24b6bb5e450a4",
                "product": "2",
                "copies": 26,
                "allowedCopies": 26,
                "lockedCopies": 26,
                "soldCopies": 4,
                "sold": false,
                "price": "9000000000000",
                "range": [
                    "52",
                    "77"
                ],
                "offerName": "OpSeTeCol3Ran8 NOT FREE",
                "diamond": true,
                "diamondRangeIndex": "12",
                "transactionHash": "0x1387645c4dce2da6c0f4993b7aa90ef5b864a462f6dfe93356940798fce04453",
                "hidden": false,
                "creationDate": "2023-09-11T16:32:54.640Z",
                "offerIndex": "37"
            },
            {
                "_id": "64ff413657d24b6bb5e457b4",
                "contract": "64ff3f5e57d24b6bb5e450a4",
                "product": "1",
                "copies": 4,
                "allowedCopies": 4,
                "lockedCopies": 4,
                "soldCopies": 0,
                "sold": false,
                "price": "0",
                "range": [
                    "20",
                    "23"
                ],
                "offerName": "OpSeTeCol2Ran5",
                "diamond": true,
                "diamondRangeIndex": "16",
                "transactionHash": "0xec57b9bc7a609048b91ce4f6e00e74262a5f1a4afdf2765f17a814cd60e508f7",
                "hidden": false,
                "creationDate": "2023-09-11T16:32:54.694Z"
            },
            {
                "_id": "64ff411157d24b6bb5e455d5",
                "contract": "64ff3f5e57d24b6bb5e450a4",
                "product": "2",
                "copies": 11,
                "allowedCopies": 11,
                "lockedCopies": 11,
                "soldCopies": 0,
                "sold": false,
                "price": "230000",
                "range": [
                    "0",
                    "10"
                ],
                "offerName": "OpSeTeCol3Ran1",
                "diamond": true,
                "diamondRangeIndex": "4",
                "transactionHash": "0x1f4bc8360dc4416a6c5f84e9c76376ba3752a977fe4221fdd38d9b17b1bda24f",
                "hidden": false,
                "creationDate": "2023-09-11T16:32:17.996Z",
                "offerIndex": "29"
            },
            {
                "_id": "64ff41e957d24b6bb5e471a9",
                "contract": "64ff41ac57d24b6bb5e458bd",
                "product": "0",
                "copies": 1988,
                "allowedCopies": 1988,
                "lockedCopies": 0,
                "soldCopies": 0,
                "sold": false,
                "price": "0",
                "range": [
                    "0",
                    "1987"
                ],
                "offerName": "Freemint",
                "diamond": true,
                "diamondRangeIndex": "0",
                "transactionHash": "0x1bfd75b2abddaa1af51c4217f8b876e06dd4b961bf6e5a2157daf5e226d750a9",
                "hidden": false,
                "creationDate": "2023-09-11T16:35:53.279Z"
            },
        ]
    }
}
```