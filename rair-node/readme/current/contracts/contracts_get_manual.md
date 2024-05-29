# Search for a contract given a blockchain and address

**URL** : `/api/contracts/network/:networkId/:contractAddress`
**Method** : `GET`

**Parameters:**
```json
{
    "networkId": { "type": "string", "required": true },
    "contractAddress": { "type": "string", "required": true },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "contract": {
        "_id": "64ff3f5757d24b6bb5e45009",
        "title": "suresh-Matic_2403",
        "user": "0x67b99531a2ab44f5c71474bd54d07fe78d7c5516",
        "blockchain": "0x13881",
        "contractAddress": "0xfd9ea47ae7dad66f4343d5fe518757dbc1dd7460",
        "diamond": false,
        "transactionHash": "0xb9db8e19c5bcb1eb14733a3d1a8e989b8da41f39e3cbd80689e16d1004ce3daa",
        "lastSyncedBlock": "26347558",
        "external": false,
        "singleMetadata": false,
        "metadataURI": "none",
        "importedBy": "",
        "creationDate": "2023-09-11T16:24:55.175Z"
    }
}
```

**Condition** : Contract not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Contract not found" }
```