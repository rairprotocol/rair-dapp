# Import external contract
Admin access required

**URL** : `/api/contracts/import`
**Method** : `POST`

**Body Parameters:**
```json
{
    "networkId": { "required": true , "content": { "type": "string" } },
    "contractAddress": { "required": true , "content": { "type": "string" } },
    "limit": { "required": true , "content": { "type": "number" } },
    "contractCreator": { "required": true, "content": { "type": "string" } }
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
        "contract": {
            "_id": "65c7fa5f3ca8294802086dcf",
            "title": "PudgyPenguins",
            "user": "0xf54c9a0e44a5f5afd27c7ac8a176a843b9114f1d",
            "blockchain": "0x1",
            "contractAddress": "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
            "diamond": false,
            "lastSyncedBlock": "0",
            "external": true,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "creationDate": "2024-02-10T22:36:15.737Z"
        },
        "numberOfTokensAdded": 10
    }
}
```

## Error Response
**Condition** : Error while importing
**Content** : 
```json
{ "success": false, "error": true, "message": "An error has ocurred!" }
```