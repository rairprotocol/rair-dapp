# Get hash to purchase resale offer

**URL** : `/api/resales/purchase/id`
**Method** : `GET`

**Parameters**
```json
{
    "id": { "required": false, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "hash": "0x2614ead30dae88cf69..."
}
```