# Get the files associated to a product
Search using network and address

**URL** : `/api/nft/network/:network/:contractAddress/:product/files`
**Method** : `GET`

**Parameters**
```json
{
    "network": { "required": true, "content": { "type": "string" } },
    "contractAddress": { "required": true, "content": { "type": "string" } },
    "product": { "required": true, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "files": [
        {
            "_id": "QmfT8BAJnzhERPmxSSwoK7pfVjpEZdRP1X7VmFTpn6Qtk3",
            "uploader": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "ageRestricted": false,
            "title": "test.mp3",
            "description": "test.mp3",
            "duration": "00:03:35.75",
            "type": "audio",
            "mainManifest": "stream.m3u8",
            "storage": "ipfs",
            "storagePath": "https://rair.mypinata.cloud/ipfs/QmfT8BAJnzhERPmxSSwoK7pfVjpEZdRP1X7VmFTpn6Qtk3",
            "staticThumbnail": "undefined",
            "animatedThumbnail": "",
            "category": "64d2a36cc6657f2b26bc5c95",
            "demo": false,
            "views": 4,
            "createdAt": "2023-08-17T03:46:47.904Z",
            "updatedAt": "2024-03-25T19:03:24.323Z",
            "hidden": false,
            "isUnlocked": true
        }
    ]
}
```

**Condition** : Contract or Product not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Data not found" }
```