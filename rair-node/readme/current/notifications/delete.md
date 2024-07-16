# Delete single notification

**URL** : `/api/notifications/`
**Method** : `DELETE`

**Body Parameters**
```json
{
    "ids": { "required": true, "content": { "type": "string[]" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
  "success": true,
  "deleted": 1
}
```