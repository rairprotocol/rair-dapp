# Get information about a single contract
Using datbase ID

**URL** : `/api/contracts/:id`
**Method** : `GET`

**Parameters:**
```json
{
    "id": { "type": "string", "required": true },
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
        "blockchain": "0x13881",
        "contractAddress": "0xfd9ea47ae7dad66f4343d5fe518757dbc1dd7460",
        "diamond": false,
        "external": false
    }
}
```

**Condition** : Contract not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "No contract found with ID ${id}" }
```