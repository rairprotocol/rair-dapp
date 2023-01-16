# Get contracts by User

Find all contracts for user with Id {req.param.userId}

**URL** : `/api/contracts/full`

**Method** : `GET`

**Query parameters:**
[same as in common get all](../readme/common_get_all.md)

## Success Response

```json
{
    "status": "success",
    "results": 2,
    "data": {
        "doc": [
            {
                "diamond": false,
                "lastSyncedBlock": "7368178",
                "external": false,
                "singleMetadata": false,
                "metadataURI": "none",
                "_id": "629f308eb550f7001d6ee2cf",
                "transactionHash": "0xc4a0d9fbab4279c036d5f276f17a1d77415fef6a76fe5f037b1f03b1c2721244",
                "title": "mike_test_001",
                "user": "0x2c1b196a2ef816d3ff5c68f22722cc49ea058a42",
                "blockchain": "0x5",
                "contractAddress": "0x205399b10bce421ecc6313a393c11f8083cd056f",
                "creationDate": "2022-06-07T11:03:42.344Z"
            },
            {
                "diamond": false,
                "lastSyncedBlock": "7090875",
                "external": false,
                "singleMetadata": false,
                "metadataURI": "none",
                "_id": "62a871e8ace598001dbf12b4",
                "transactionHash": "0xcb23378189f8cfc84ebd9713e654250ead7352f228b63ac1ac853da38ab82572",
                "title": "Mike_test_contract_2",
                "user": "0x2c1b196a2ef816d3ff5c68f22722cc49ea058a42",
                "blockchain": "0x5",
                "contractAddress": "0x092b47bf77ac44a4655e3fe5ff0cc2d5096a76a6",
                "creationDate": "2022-06-14T11:32:56.632Z"
            }
        ]
    }
}
```

## Error respond

Wrong user ID (no such user)

```json
{
    "success": false,
    "error": true,
    "message": "No user with such ID"
}
```
No Contract for this user / no contract with such query parameters

```json
{
    "success": false,
    "error": true,
    "message": "No doc found"
}
```