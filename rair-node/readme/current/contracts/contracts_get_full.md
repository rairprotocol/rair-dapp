# Full contract list
With information about products and offers

**URL** : `/api/contracts/full`
**Method** : `GET`

**Query parameters**
```json
{
    "pageNum": { "required": false, "content": { "type": "number"} },
    "itemsPerPage": { "required": false, "content": { "type": "number"} },
    "blockchain": { "required": false, "content": { "type": "string"} },
    "category": { "required": false, "content": { "type": "string"} },
    "userAddress": { "required": false, "content": { "type": "string"} },
    "contractAddress": { "required": false, "content": { "type": "string"} },
    "hidden": { "required": false, "content": { "type": "boolean"} },
    "mediaTitle": { "required": false, "content": { "type": "string"} },
    "contractTitle": { "required": false, "content": { "type": "string"} }
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "contracts": [
        {
            "_id": "64ff3f5757d24b6bb5e45051",
            "title": "OpSeTe Neo",
            "user": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "blockchain": "0x13881",
            "contractAddress": "0xf259e08357e8ac87d3ac45d92c0455bd51efc0a0",
            "diamond": true,
            "transactionHash": "0x392b566a2f8b020883a9fee4a67b34a078a5a6db81ade7a221ddcfa29cdd0bf9",
            "lastSyncedBlock": "39548251",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "blockSync": false,
            "blockView": false,
            "creationDate": "2023-09-11T16:24:55.227Z",
            "products": {
                "_id": "64ff42eb57d24b6bb5e56e6b",
                "name": "#001",
                "collectionIndexInContract": "0",
                "contract": "64ff3f5757d24b6bb5e45051",
                "copies": 100,
                "soldCopies": 41,
                "sold": false,
                "royalty": 0,
                "firstTokenIndex": "0",
                "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
                "transactionHash": "0x4a443d2a5fa90a91928e818daea7f1e9577e41ed49ff07068bfa50040083e4c4",
                "diamond": true,
                "singleMetadata": false,
                "metadataURI": "none",
                "creationDate": "2023-09-11T16:40:11.699Z",
                "offers": [
                    {
                        "_id": "64ff42eb57d24b6bb5e56e71",
                        "contract": "64ff3f5757d24b6bb5e45051",
                        "product": "0",
                        "copies": 11,
                        "allowedCopies": 11,
                        "lockedCopies": 0,
                        "soldCopies": 40,
                        "sold": false,
                        "price": "0",
                        "range": [
                            "0",
                            "10"
                        ],
                        "offerName": "#01#01",
                        "diamond": true,
                        "diamondRangeIndex": "0",
                        "transactionHash": "0xb85fde3003da692c752ef0d4a302c1b63e61531d774f7c176478d876c16b566b",
                        "hidden": false,
                        "creationDate": "2023-09-11T16:40:11.706Z",
                        "offerIndex": "41"
                    },
                    {
                        "_id": "64ff42eb57d24b6bb5e56e94",
                        "contract": "64ff3f5757d24b6bb5e45051",
                        "product": "0",
                        "copies": 14,
                        "allowedCopies": 14,
                        "lockedCopies": 14,
                        "soldCopies": 1,
                        "sold": false,
                        "price": "0",
                        "range": [
                            "11",
                            "24"
                        ],
                        "offerName": "#01#02",
                        "diamond": true,
                        "diamondRangeIndex": "1",
                        "transactionHash": "0xef1abc14b10b0ad8eb18055fbdde46c7956cd32ef51f8e17029ed1e702fa18c8",
                        "hidden": false,
                        "creationDate": "2023-09-11T16:40:11.732Z",
                        "offerIndex": "80"
                    }
                ]
            }
        },
        {
            "_id": "64ff440357d24b6bb5e672da",
            "title": "03-10-new-contract",
            "user": "0x0082c81367f9084fc3cc2400c3826dafac2516bb",
            "blockchain": "0x5",
            "contractAddress": "0xd0110a413940ccfb5741efc98095652471bc6b78",
            "diamond": true,
            "transactionHash": "0x33c947ef6f4e7629b6a3d0d2fe0f982602ca70fb876b5aac45c7088c4f9a9176",
            "lastSyncedBlock": "9777413",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "blockSync": false,
            "blockView": false,
            "creationDate": "2023-09-11T16:44:51.278Z",
            "products": {
                "_id": "64ff477957d24b6bb5e72ba7",
                "name": "03-10-new-collection",
                "collectionIndexInContract": "0",
                "contract": "64ff440357d24b6bb5e672da",
                "copies": 30,
                "soldCopies": 4,
                "sold": false,
                "royalty": 0,
                "firstTokenIndex": "0",
                "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
                "transactionHash": "0xaaba2dea74ffba6d326e5f77495fc087b05ca06951c21842522c9d0ca2a20153",
                "diamond": true,
                "singleMetadata": false,
                "metadataURI": "none",
                "creationDate": "2023-09-11T16:59:37.869Z",
                "offers": [
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
        },
    ],
    "totalNumber": 386
}
```