# Get a single file's information 
Unpins content

**URL** : `/api/files/byId/:mediaId`
**Method** : `GET`

**Parameters:**
```json
{
    "mediaId": { "required": true , "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "file": {
        "hidden": false,
        "_id": "qO9Qy7G0xi6mH3VCXLDNUC4XX80C7o0nkMx0_w371X2k8a",
        "demo": false,
        "uri": "https://storage.googleapis.com/rair-videos/qO9Qy7G0xi6mH3VCXLDNUC4XX80C7o0nkMx0_w371X2k8a",
        "encryptionType": "aes-256-gcm",
        "title": "NAVI Preview",
        "category": null,
        "staticThumbnail": "https://storage.googleapis.com/rair-videos/qO9Qy7G0xi6mH3VCXLDNUC4XX80C7o0nkMx0_w371X2k8a/thumbnail.webp",
        "animatedThumbnail": "https://storage.googleapis.com/rair-videos/qO9Qy7G0xi6mH3VCXLDNUC4XX80C7o0nkMx0_w371X2k8a/thumbnail.gif",
        "type": "video",
        "duration": "00:01:10.08",
        "description": "Navi's ukrainian eSport team 123",
        "totalEncryptedFiles": 1,
        "views": 18,
        "updatedAt": "2023-08-02T13:13:35.018Z",
        "ageRestricted": false,
        "uploader": "0x43f2fe4b1ce105f9fa5c10b7f2c072c4dcb709ae"
    }
}
```
