# Find media files given a category ID

**URL** : `/api/files/byCategory/:id`
**Method** : `GET`

**Parameters:**
```json
{
    "id": { "required": true , "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "totalCount": 28,
    "files": [
        {
            "hidden": false,
            "ageRestricted": false,
            "_id": "QmSJ5y6TWTj4YJj17EFWwRPGZTQY5UVwBg2Fp8eGDCcnez",
            "demo": false,
            "uri": "https://rair.mypinata.cloud/ipfs/QmSJ5y6TWTj4YJj17EFWwRPGZTQY5UVwBg2Fp8eGDCcnez",
            "encryptionType": "aes-256-gcm",
            "title": "Against the Tide",
            "category": "64d2a36cc6657f2b26bc5c95",
            "staticThumbnail": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "animatedThumbnail": "",
            "type": "audio",
            "duration": "00:05:50.15",
            "description": "Test",
            "totalEncryptedFiles": 1,
            "views": 69,
            "uploader": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "updatedAt": "2023-08-02T02:39:27.417Z"
        },
        {
            "hidden": false,
            "_id": "QmQsHjSR8a4tvbJ21pnZssuECfE2xgQHHHBTseibD2vDwj",
            "demo": false,
            "uri": "https://rair.mypinata.cloud/ipfs/QmQsHjSR8a4tvbJ21pnZssuECfE2xgQHHHBTseibD2vDwj",
            "encryptionType": "aes-256-gcm",
            "title": "10. Gift for You.mp3",
            "category": "64d2a36cc6657f2b26bc5c95",
            "staticThumbnail": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "animatedThumbnail": "",
            "type": "audio",
            "duration": "00:05:46.78",
            "description": "Test 2",
            "totalEncryptedFiles": 1,
            "views": 28,
            "uploader": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "updatedAt": "2023-08-15T14:57:31.879Z",
            "ageRestricted": false
        },
        {
            "hidden": false,
            "ageRestricted": false,
            "_id": "QmbwCNt1f47aeg1D1Ch4voG1aY9z97JmbaMc6Yg7iJvfrr",
            "demo": false,
            "encryptionType": "aes-256-gcm",
            "title": "qwe",
            "category": "64d2a36cc6657f2b26bc5c95",
            "staticThumbnail": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "animatedThumbnail": "",
            "type": "audio",
            "duration": "00:05:00.88",
            "description": "eee",
            "totalEncryptedFiles": 1,
            "views": 1,
            "uploader": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3"
        },
    ]
}
```