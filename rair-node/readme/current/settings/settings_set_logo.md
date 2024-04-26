# Set a custom logo

**URL** : `/api/settings/appLogo`
**Method** : `POST`

**Body Parameters**
```json
{
    "logoImage": { "required": false, "content": { "type": "file" } },
    "target": { "required": false, "content": { "type": "string" } },
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