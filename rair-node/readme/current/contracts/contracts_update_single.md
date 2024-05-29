# Update visibility of contract
Super admin access required

**URL** : `/api/contracts/:id`
**Method** : `PATCH`

**Parameters:**
```json
{
    "id": { "type": "string", "required": true },
}
```

**Body parameters**
```json
{
    "blockSync": { "type": "boolean", "required": true },
    "blockView": { "type": "boolean", "required": true },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "data": {
        "doc": {
            "_id": "64ff440657d24b6bb5e6758e",
            "title": "01072022-1",
            "user": "0x67b99531a2ab44f5c71474bd54d07fe78d7c5516",
            "blockchain": "0x5",
            "contractAddress": "0xce28546d4cd6ed64d9c91657647f062605392f02",
            "diamond": true,
            "transactionHash": "0x42cded32f5966b8228d71b18377ae69da712cd265bdf268ca229fecc3455a221",
            "lastSyncedBlock": "7685274",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "creationDate": "2023-09-11T16:44:54.874Z"
        }
    }
}
```

**Condition** : Contract not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "No document found with ID ${id}" }
```