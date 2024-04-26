
# Verify information for the video file
This is used by the media service

**URL** : `/api/upload/validate`
**Method** : `GET`

**Query Parameters**
```json
{
    "offers": { "required": true, "content": { "type": "string" } },
    "category": { "required": true, "content": { "type": "string" } },
    "demo": { "required": true, "content": { "type": "string" } },
    "demoEndpoint": { "required": true, "content": { "type": "string" } },
    "publicAddress": { "required": true, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "ok": true,
    "offers": ["64c17180a28f4065d5573dd7"],
}
```