# Remove media

Register a new piece of media. Optinally provide a decrypt key

**URL** : `/api/media/remove/:mediaId`

**Method** : `DELETE`

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

## Success Response

Returns if media successfully found and deleted

**Code** : `200 OK`
