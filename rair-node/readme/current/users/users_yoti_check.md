# Verify the current user's age with Yoti

**URL** : `/api/users/yoti-verify`
**Method** : `POST`

**Body Parameters**
```json
{
    "image": { "required": true, "content": { "type": "file" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "data": true
}
```