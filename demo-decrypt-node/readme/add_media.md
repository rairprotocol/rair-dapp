# Register a new piece of media

Register a new piece of media. Optionally provide a decrypt key. Also pins the content in the provided IPFS store

**URL** : `/api/media/add/:mediaId`

**Method** : `POST`

**Parameters:**

```json
{
  "mediaId": {
    "description": "The IPFS content identifier (CID) for a RAIR compatible media folder. Must contain a rair.json manifest.",
    "type": "string",
    "required": true
  }
}
```

**Request body:**

```json
{
  "description": "A .key file containing the private key for this media stream in binary encoding",
  "required": false,
  "content": {
    "type": "string",
    "format": "binary"
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
  "message": "Cannot retrieve rair.json manifest for [mediaId]. Check the CID is correct and is a folder containing a manifest. [Original error]"
}
```
