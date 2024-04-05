# Update the values for a specific blockchain

**URL** : `/api/settings/:blockchain`
**Method** : `PUT`

**Parameters**
```json
{
    "blockchain": { "required": true, "content": { "type": "string" } }
}
```
**Body Parameters**
```json
{
    "display": { "required": true, "content": { "type": "boolean" } },
    "sync": { "required": true, "content": { "type": "boolean" } }
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
}
```