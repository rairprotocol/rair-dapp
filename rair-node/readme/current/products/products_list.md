# Search through all products
Does not support pagination

**URL** : `/api/products/`
**Method** : `GET`

**Query Parameters**
```json
{
    "name": { "required": false, "content": { "type": "string" } },
    "collectionIndexInContract": { "required": false, "content": { "type": "string" } },
    "contract": { "required": false, "content": { "type": "string" } },
    "copies": { "required": false, "content": { "type": "string" } },
    "soldCopies": { "required": false, "content": { "type": "string" } },
    "sold": { "required": false, "content": { "type": "string" } },
    "royalty": { "required": false, "content": { "type": "string" } },
    "firstTokenIndex": { "required": false, "content": { "type": "string" } },
    "cover": { "required": false, "content": { "type": "string" } },
    "creationDate": { "required": false, "content": { "type": "string" } },
    "transactionHash": { "required": false, "content": { "type": "string" } },
    "diamond": { "required": false, "content": { "type": "boolean" } },
    "singleMetadata": { "required": false, "content": { "type": "string" } },
    "metadataURI": { "required": false, "content": { "type": "string" } },
    
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
            },
            {
                "_id": "64ff406457d24b6bb5e45383",
                "name": "Test Media",
                "collectionIndexInContract": "0",
                "contract": "64ff3f5757d24b6bb5e45036",
                "copies": 3,
                "soldCopies": 0,
                "sold": false,
                "royalty": 0,
                "firstTokenIndex": "0",
                "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
                "transactionHash": "0x08ead70b2b97f6a85b2b9099bd6e6bc1bf4643903b06999b91ba8cca9026d882",
                "diamond": false,
                "singleMetadata": false,
                "metadataURI": "none",
                "creationDate": "2023-09-11T16:29:24.222Z"
            },
            {
                "_id": "64ff3fda57d24b6bb5e452a7",
                "name": "product-1_suresh-tMatic_2604-1",
                "collectionIndexInContract": "0",
                "contract": "64ff3f5757d24b6bb5e4501b",
                "copies": 500,
                "soldCopies": 0,
                "sold": false,
                "royalty": 0,
                "firstTokenIndex": "0",
                "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
                "transactionHash": "0xa8878466bb117393c0bf89c52f263a75d14e287610d541e7f9f9305bb6ad126f",
                "diamond": false,
                "singleMetadata": false,
                "metadataURI": "none",
                "creationDate": "2023-09-11T16:27:06.396Z"
            },
            {
                "_id": "64ff411157d24b6bb5e45592",
                "name": "OSTCol2",
                "collectionIndexInContract": "1",
                "contract": "64ff3f5e57d24b6bb5e450a4",
                "copies": 9000,
                "soldCopies": 4,
                "sold": false,
                "royalty": 0,
                "firstTokenIndex": "79",
                "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
                "transactionHash": "0xc545be139d0ba930d7468ae2606455449089a3c901f5ad4d245e411d40b53d8a",
                "diamond": true,
                "singleMetadata": false,
                "metadataURI": "none",
                "creationDate": "2023-09-11T16:32:17.968Z"
            }
        ]
    }
}
```