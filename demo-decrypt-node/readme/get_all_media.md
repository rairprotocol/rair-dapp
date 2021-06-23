# Get all media

List all the registered media, their URIs and encrypted status

**URL** : `/api/media/list`

**Method** : `GET`

## Success Response

Returns a list of the currently registered media

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "list": {
    "QmfUHHWHaT1jCuiMcJGZJG4pdo4A6ddoaZKPz6rbCDeNMA": {
            "_id": "QmfUHHWHaT1jCuiMcJGZJG4pdo4A6ddoaZKPz6rbCDeNMA",
            "key": {
                "type": "Buffer",
                "data": [
                    134,
                    55,
                    22,
                    45,
                    244,
                    210,
                    171,
                    198,
                    225,
                    38,
                    11,
                    47,
                    107,
                    6,
                    250,
                    139
                ]
            },
            "mainManifest": "stream.m3u8",
            "author": "author NFT",
            "encryptionType": "aes-128-cbc",
            "title": "M01",
            "thumbnail": "1624271911556-887258899",
            "currentOwner": "author NFT",
            "contractAddress": "temp value of contract address",
            "description": "Desc 01",
            "uri": "http://rairipfs:8080/ipfs/QmfUHHWHaT1jCuiMcJGZJG4pdo4A6ddoaZKPz6rbCDeNMA",
            "creationDate": "2021-06-21T10:38:34.095Z"
        },
    ...
  }
}
```
