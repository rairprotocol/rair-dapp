# List all files

**URL** : `/api/files/list`
**Method** : `GET`

**Query Parameters**
```json
{
    "pageNum": {"required": false, "content": {"type": "string"}},
    "itemsPerPage": {"required": false, "content": {"type": "string"}},

    "blockchain": {"required": false, "content": {"type": "string"}},
    "userAddress": {"required": false, "content": {"type": "string"}},
    "contractAddress": {"required": false, "content": {"type": "string"}},
    "mediaTitle": {"required": false, "content": {"type": "string"}},
    "contractTitle": {"required": false, "content": {"type": "string"}},

    "author": {"required": false ,"content": {"type": "string"}},
    "uploader": {"required": false ,"content": {"type": "string"}},
    "title": {"required": false ,"content": {"type": "string"}},
    "description": {"required": false ,"content": {"type": "string"}},
    "contract": {"required": false ,"content": {"type": "string"}},
    "product": {"required": false ,"content": {"type": "string"}},
    "offer": {"required": false ,"content": {"type": "string"}},
    "category": {"required": false ,"content": {"type": "string"}},
    "demo": {"required": false ,"content": {"type": "string"}},
    "ageRestricted": {"required": false ,"content": {"type": "string"}},
    "hidden": {"required": false ,"content": {"type": "string"}},
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "list": {
        "QmfT8BAJnzhERPmxSSwoK7pfVjpEZdRP1X7VmFTpn6Qtk3": {
            "_id": "QmfT8BAJnzhERPmxSSwoK7pfVjpEZdRP1X7VmFTpn6Qtk3",
            "uploader": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "ageRestricted": false,
            "title": "06. Good L_ck (Yo_'re F_cked)",
            "description": "06. Good L_ck (Yo_'re F_cked).mp3",
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
            "updatedAt": "2024-03-18T19:05:08.746Z",
            "hidden": false,
            "unlockData": {
                "offers": [
                    {
                        "_id": "65414514a83090be43bccd85",
                        "contract": "6541442aa83090be43bccd74",
                        "product": "0",
                        "copies": 10,
                        "allowedCopies": 10,
                        "lockedCopies": 0,
                        "soldCopies": 2,
                        "sold": false,
                        "price": "100000000000000000",
                        "range": [
                            "0",
                            "9"
                        ],
                        "offerName": "Deluxe",
                        "diamond": true,
                        "diamondRangeIndex": "0",
                        "transactionHash": "0x77d759aa37dcba57f44d48580957cf36a599c15cc478f18af8b7be575e8de68d",
                        "hidden": false,
                        "creationDate": "2023-10-31T18:19:00.610Z",
                        "offerIndex": "69"
                    }
                ]
            },
            "isUnlocked": true
        },
    },
    "totalNumber": 23
}
```