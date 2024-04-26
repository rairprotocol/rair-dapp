# List favorite token for current user

**URL** : `/api/favorites/`
**Method** : `GET`

**Body Parameters:**
**Parameters:**
```json
{
    "id": { "required": true , "content": { "type": "string" } },
}
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
            "_id": "6601bfd97f2f949a695c1180",
            "userAddress": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "token": {
                "_id": "64ff4a1d57d24b6bb5e809c1",
                "token": "1",
                "uniqueIndexInContract": "1",
                "ownerAddress": "0x0000000000000000000000000000000000000000",
                "offer": "0",
                "contract": "64ff440357d24b6bb5e673d6",
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
                "creationDate": "2023-09-11T17:10:53.905Z"
            },
            "contract": {
                "_id": "64ff440357d24b6bb5e673d6",
                "title": "10 november contract",
                "user": "0x789ea02c526066d90912d7dc0b935a54393f4c10",
                "blockchain": "0x5",
                "contractAddress": "0x4f75ff35292829a18c5f57c2394d0d73c88ec7ce",
                "diamond": true,
                "transactionHash": "0x8362578b2516e61b3a11b942687980c808ef0ed0e5a56d2cd72c82a16beaea85",
                "lastSyncedBlock": "7926802",
                "external": false,
                "singleMetadata": false,
                "metadataURI": "none",
                "importedBy": "",
                "blockSync": false,
                "blockView": false,
                "creationDate": "2023-09-11T16:44:51.337Z"
            }
        }
    ]
}
```