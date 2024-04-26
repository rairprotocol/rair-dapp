# List all unlocks for a file
Includes offer and contract information

**URL** : `/api/files/:id/unlocks`
**Method** : `GET`

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "data": {
        "_id": "6512dd896916edf7fc4f740b",
        "file": "kXOzboVtQStp6WDUIoUok9MV4uST5sfztaBe3d0mv63ywn",
        "offers": [
            {
                "_id": "64ff462d57d24b6bb5e6e674",
                "contract": {
                    "_id": "64ff440357d24b6bb5e6724e",
                    "title": "sept-22-09-contract",
                    "user": "0x0082c81367f9084fc3cc2400c3826dafac2516bb",
                    "blockchain": "0x5",
                    "contractAddress": "0xc379d9d22b7e350c213d089bed8e76939c8516e9",
                    "diamond": true,
                    "transactionHash": "0xf2d12516bafbca2753e3377ab7bb6aa2bcb37be5711dccaf38d8b7cf4a2376cf",
                    "lastSyncedBlock": "7639038",
                    "external": false,
                    "singleMetadata": false,
                    "metadataURI": "none",
                    "importedBy": "",
                    "creationDate": "2023-09-11T16:44:51.243Z"
                },
                "product": "0",
                "copies": 3,
                "allowedCopies": 3,
                "lockedCopies": 3,
                "soldCopies": 0,
                "sold": false,
                "price": "100",
                "range": [
                    "0",
                    "2"
                ],
                "offerName": "sept-22-09-offer-1",
                "diamond": true,
                "diamondRangeIndex": "0",
                "transactionHash": "0xd72d1019692650ab422e15bb7c335995ac6590cdce0ac135a55513f8e4a34dc0",
                "hidden": false,
                "creationDate": "2023-09-11T16:54:05.829Z"
            },
            {
                "_id": "64ff462d57d24b6bb5e6e680",
                "contract": {
                    "_id": "64ff440357d24b6bb5e6724e",
                    "title": "sept-22-09-contract",
                    "user": "0x0082c81367f9084fc3cc2400c3826dafac2516bb",
                    "blockchain": "0x5",
                    "contractAddress": "0xc379d9d22b7e350c213d089bed8e76939c8516e9",
                    "diamond": true,
                    "transactionHash": "0xf2d12516bafbca2753e3377ab7bb6aa2bcb37be5711dccaf38d8b7cf4a2376cf",
                    "lastSyncedBlock": "7639038",
                    "external": false,
                    "singleMetadata": false,
                    "metadataURI": "none",
                    "importedBy": "",
                    "creationDate": "2023-09-11T16:44:51.243Z"
                },
                "product": "0",
                "copies": 3,
                "allowedCopies": 3,
                "lockedCopies": 3,
                "soldCopies": 0,
                "sold": false,
                "price": "200",
                "range": [
                    "3",
                    "5"
                ],
                "offerName": "sept-22-09-offer-2",
                "diamond": true,
                "diamondRangeIndex": "1",
                "transactionHash": "0xd72d1019692650ab422e15bb7c335995ac6590cdce0ac135a55513f8e4a34dc0",
                "hidden": false,
                "creationDate": "2023-09-11T16:54:05.842Z"
            },
            {
                "_id": "64ff462d57d24b6bb5e6e68c",
                "contract": {
                    "_id": "64ff440357d24b6bb5e6724e",
                    "title": "sept-22-09-contract",
                    "user": "0x0082c81367f9084fc3cc2400c3826dafac2516bb",
                    "blockchain": "0x5",
                    "contractAddress": "0xc379d9d22b7e350c213d089bed8e76939c8516e9",
                    "diamond": true,
                    "transactionHash": "0xf2d12516bafbca2753e3377ab7bb6aa2bcb37be5711dccaf38d8b7cf4a2376cf",
                    "lastSyncedBlock": "7639038",
                    "external": false,
                    "singleMetadata": false,
                    "metadataURI": "none",
                    "importedBy": "",
                    "creationDate": "2023-09-11T16:44:51.243Z"
                },
                "product": "0",
                "copies": 3,
                "allowedCopies": 3,
                "lockedCopies": 3,
                "soldCopies": 0,
                "sold": false,
                "price": "300",
                "range": [
                    "6",
                    "8"
                ],
                "offerName": "sept-22-09-offer-3",
                "diamond": true,
                "diamondRangeIndex": "2",
                "transactionHash": "0xd72d1019692650ab422e15bb7c335995ac6590cdce0ac135a55513f8e4a34dc0",
                "hidden": false,
                "creationDate": "2023-09-11T16:54:05.855Z"
            }
        ]
    }
}
```