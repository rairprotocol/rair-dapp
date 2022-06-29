# Add file after upload media

Add file with media data

**URL** : `/api/v2/upload/file`

**Method** : `POST`

**Request body:**

```json
 {
  "cid": "gQrotDfRLLnJ3rWiXvd3mVwJwFrJ4lWnZMp7L",
  "key": {
        "key": { "type": "Buffer", "data": [Array] },
        "authTag": {
            "1080p0": "351b6a0a9a6750bbe9a4f9dd71e58927",
            "1080p1": "ab1be0d1ca02f7d55953665d01d8c940",
        .....
      }
  },
  "storageLink": "https://storage.googleapis......",
  "meta": {
     "mainManifest": "stream.m3u8",
     "author": "some toket",
     "authorPublicAddress": "some public address",
     "encryptionType": "aes-256-gcm",
     "title": "some title",
     "contract": "contract id",
     "product": "0",
     "offer": [ "0" ],
     "category": "62948796558076001e29bb5d",
     "staticThumbnail": "https://storage.googleapis.com.......",
     "animatedThumbnail": "https://storage.googleapis.com.....",
     "type": "video",
     "extension": "mp4",
     "duration": "00:00:23.76",
     "demo": false,
     "description": "some description"
   }
 }

```

## Success Response

Returns if added successfully

**Code** : `200 OK`

## Error Response

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "Faild add data"
}