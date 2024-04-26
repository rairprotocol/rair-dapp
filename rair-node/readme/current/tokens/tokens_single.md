# Get the full information from a token
Including offer, product and contract data

**URL** : `/api/tokens/id/:id`
**Method** : `GET`

**Parameters**
```json
{
    "id": { "required": true, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "tokenData": {
        "_id": "64ff47da57d24b6bb5e7335a",
        "token": "0",
        "uniqueIndexInContract": "0",
        "ownerAddress": "0xa409a6b5f68275cdbb56634f52f07e12c7cb58f5",
        "offer": "0",
        "contract": {
            "_id": "64ff440357d24b6bb5e67302",
            "title": "07-10-test-buy",
            "user": "0x0082c81367f9084fc3cc2400c3826dafac2516bb",
            "blockchain": "0x5",
            "contractAddress": "0x0661fc0c10c2eabf3d37aba1b4f4fba53bbb33eb",
            "diamond": true,
            "transactionHash": "0x84aaf410847df700f675f812a8243c1ac57518c67ae8a5d0696cede49d48f0fa",
            "lastSyncedBlock": "7728181",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "creationDate": "2023-09-11T16:44:51.287Z"
        },
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
        "creationDate": "2023-09-11T17:01:14.679Z",
        "range": {
            "_id": "64ff47da57d24b6bb5e73357",
            "contract": "64ff440357d24b6bb5e67302",
            "product": "0",
            "copies": 2,
            "allowedCopies": 2,
            "lockedCopies": 2,
            "soldCopies": 2,
            "sold": false,
            "price": "3000",
            "range": [
                "0",
                "1"
            ],
            "offerName": "07-10-test-range-1",
            "diamond": true,
            "diamondRangeIndex": "0",
            "transactionHash": "0x3a48d7413ee06a55a93dfc4dd08fdc932e6f8fd506de10f7e4dc081f5883894f",
            "hidden": false,
            "creationDate": "2023-09-11T17:01:14.676Z",
            "offerIndex": "87"
        },
        "product": {
            "_id": "64ff47da57d24b6bb5e73351",
            "name": "07-10-test-buy-collection-1",
            "collectionIndexInContract": "0",
            "contract": "64ff440357d24b6bb5e67302",
            "copies": 8,
            "soldCopies": 6,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "0",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0xd7526280bc1d910561d003e1d45a131db76e71e35f8228e8a1366da177db79c7",
            "diamond": true,
            "singleMetadata": false,
            "metadataURI": "none",
            "creationDate": "2023-09-11T17:01:14.670Z"
        }
    }
}
```