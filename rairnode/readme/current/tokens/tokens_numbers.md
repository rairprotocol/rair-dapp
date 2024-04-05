# Get all token numbers available in a contract
Ideally add used with the offers param

**URL** : `/api/tokens/tokenNumbers`
**Method** : `GET`

**Query Parameters**
```json
{
    "contract": { "required": true, "content": { "type": "string" } },
    "offerPool": { "required": true, "content": { "type": "string" } },
    "offers": { "required": false, "content": { "type": "string[]" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "tokens": [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7"
    ]
}
```