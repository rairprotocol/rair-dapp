
# Add a media file to the database
This is used by the media service

**URL** : `/api/upload/file`
**Method** : `POST`

**Query Parameters**
```json
{
    "cid": { "required": true, "content": { "type": "string" } },
    "meta": {
        "required": true,
        "content": {
            "mainManifest": { "required": true, "content": { "type": "string" } },
            "uploader": { "required": true, "content": { "type": "string" } },
            "encryptionType": { "required": true, "content": { "type": "string" } },
            "title": { "required": false, "content": { "type": "string" } },
            "offers": { "required": false, "content": { "type": "string" } },
            "category": { "required": true, "content": { "type": "string" } },
            "staticThumbnail": { "required": false, "content": { "type": "string" } },
            "animatedThumbnail": { "required": false, "content": { "type": "string" } },
            "type": { "required": true, "content": { "type": "string" } },
            "extension": { "required": true, "content": { "type": "string" } },
            "duration": { "required": true, "content": { "type": "string" } },
            "demo": { "required": false, "content": { "type": "string" } },
            "totalEncryptedFiles": { "required": false, "content": { "type": "string" } },
            "storage": { "required": true, "content": { "type": "string" } },
            "storagePath": { "required": true, "content": { "type": "string" } },
            "description": { "required": false, "content": { "type": "string" } },
        }
    },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "ok": true,
}
```