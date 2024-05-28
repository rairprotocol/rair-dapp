# Search through all products of a user
Using ETH address to search

**URL** : `/api/products/user/:userAddress`
**Method** : `GET`

**Parameters**
```json
{
    "userAddress": { "required": false, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "products": [
        {
            "_id": "64ff466557d24b6bb5e6e8e4",
            "name": "DDD",
            "collectionIndexInContract": "4",
            "contract": "64ff440357d24b6bb5e67266",
            "copies": 40,
            "soldCopies": 0,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "2070",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0x6f26e12c9ba23fc770346e2adf626f439e7768525c2078ee36ef5478ea482814",
            "diamond": true,
            "singleMetadata": false,
            "metadataURI": "none",
            "creationDate": "2023-09-11T16:55:01.383Z"
        },
        {
            "_id": "64ff466557d24b6bb5e6e8f8",
            "name": "HHH",
            "collectionIndexInContract": "8",
            "contract": "64ff440357d24b6bb5e67266",
            "copies": 33,
            "soldCopies": 0,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "2295",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0x67eb21c65d763fc7053d884bc88c9bd6ffaf0d1efa68a4a21959b145506767b5",
            "diamond": true,
            "singleMetadata": false,
            "metadataURI": "none",
            "creationDate": "2023-09-11T16:55:01.395Z"
        },
        {
            "_id": "64ff44a657d24b6bb5e68ca5",
            "name": "Extension1Col1",
            "collectionIndexInContract": "0",
            "contract": "64ff440357d24b6bb5e671a6",
            "copies": 2000,
            "soldCopies": 4,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "0",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0x2b9e2ac2b1d32cd830b9af51f077902d210fea7b149e9416ef0c677a644f309c",
            "diamond": true,
            "singleMetadata": false,
            "metadataURI": "none",
            "creationDate": "2023-09-11T16:47:34.064Z"
        },
        {
            "_id": "64ff445857d24b6bb5e6823e",
            "name": "QWE",
            "collectionIndexInContract": "0",
            "contract": "64ff440657d24b6bb5e67525",
            "copies": 4000,
            "soldCopies": 0,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "0",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0xd245c7738943dcc0ed007579bef1e168e581353b9df2b96dcee94c1b4e8101f4",
            "diamond": true,
            "singleMetadata": false,
            "metadataURI": "none",
            "creationDate": "2023-09-11T16:46:16.027Z"
        },
        {
            "_id": "64ff488d57d24b6bb5e7499e",
            "name": "10k test",
            "collectionIndexInContract": "1",
            "contract": "64ff440357d24b6bb5e67342",
            "copies": 11000,
            "soldCopies": 8,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "200",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0xa3d27f3854224d21234375f3968296677daba197d0e5bf182ce2cfa7f3417441",
            "diamond": true,
            "singleMetadata": false,
            "metadataURI": "none",
            "creationDate": "2023-09-11T17:04:13.138Z"
        },
        {
            "_id": "64ff411157d24b6bb5e455ce",
            "name": "OST5Col3",
            "collectionIndexInContract": "2",
            "contract": "64ff3f5e57d24b6bb5e450a4",
            "copies": 200,
            "soldCopies": 8,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "9079",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0xbfa3873fb67540285695882cfbefec1b89fb03682ef00ca1c2686089bf22e203",
            "diamond": true,
            "singleMetadata": false,
            "metadataURI": "none",
            "creationDate": "2023-09-11T16:32:17.993Z"
        },
    ]
}
```