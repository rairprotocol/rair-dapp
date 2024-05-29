# Process a blockchain transaction
Using numerical values instead of IDs

**URL** : `/api/transaction/:network/:hash`
**Method** : `GET`

**Parameters**
```json
{
    "number": { "required": true, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "foundEvents": []
}
```