# Update an already existing offer

**URL** : `/api/resales/update`
**Method** : `PUT`

**Body Parameters**
```json
{
    "id": { "required": false, "content": { "type": "string" } },
    "price": { "required": false, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true
}
```