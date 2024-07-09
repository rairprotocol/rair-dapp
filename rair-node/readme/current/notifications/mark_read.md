# Mark single notification as read

**URL** : `/api/notifications/`
**Method** : `PUT`

**Body Parameters**
```json
{
    "ids": { "required": false, "content": { "type": "string[]" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
  "success": true,
  "updated": 3
}
```