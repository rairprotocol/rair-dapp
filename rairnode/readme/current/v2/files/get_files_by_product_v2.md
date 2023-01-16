# Get files by product

Get all files which belong particular product

**URL** : `/api/v2/files`

**Method** : `GET`

**Headers:**

```json
{
  "x-rair-token": {
    "required": false,
    "content": {
      "type": "string"
    }
  }
}
```

**Query parameters:**

```json
{
  "contract": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "product": {
    "required": true,
    "content": {
      "type": "number"
    }
  }
}
```

## Success Response

Returns a list of the files information

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "status": "success",
  "results": 1,
  "data": {
    "doc": [
      {
        "isUnlocked": false,
        "offer": [
          "0"
        ],
        "demo": false,
        "_id": "QqYZxGHgNhSph-RbsECFlY5ObXNmOvsDCJK4ezbU_RaWHd",
        "mainManifest": "stream.m3u8",
        "authorPublicAddress": "address",
        "encryptionType": "aes-256-gcm",
        "title": "File 18",
        "contract": "62c1da143d0b4e9133e094a7",
        "product": "0",
        "category": "62c1d9d7d5854b001c06cce2",
        "staticThumbnail": "https://some.link",
        "animatedThumbnail": "https://some.link",
        "type": "video",
        "extension": "quicktime",
        "duration": "00:00:30.57",
        "description": "Desc File 18",
        "creationDate": "2022-08-08T14:15:12.252Z"
      },
      ...
    ]
  }
}
```
