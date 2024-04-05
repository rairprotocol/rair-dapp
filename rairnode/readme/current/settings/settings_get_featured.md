# Get featured product

**URL** : `/api/settings/featured`
**Method** : `GET`


## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "data": {
        "blockchain": "0x5",
        "contract": "0xe583e6e...",
        "product": "0",
        "collectionName": "Test#001",
        "collectionBanner": "https://ipfs.io/ipfs/Qmdgud3qv...",
        "user": {
            "_id": "64c17180a28f4065d5573dd7",
            "avatar": "storage.url...",
            "publicAddress": "0xec307...",
            "nickName": "0xec30759d0a..."
        }
    }
}
```