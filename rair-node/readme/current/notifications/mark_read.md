# Mark single notification as read

**URL** : `/api/notifications/:id`
**Method** : `PUT`

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
  "notification": {
    "_id": "6657edb4d1f06c7b91e39089",
    "user": "0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
    "type": "message",
    "message": "Logged in as 0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
    "data": [],
    "read": false
  },
}
```