# Get files by NFT token

Get all files which belong particular NFT token

**URL** : `/api/nft/network/:networkId/:contract/:product/files/:token`

**Method** : `GET`

**Parameters:**

```json
{
  "networkId": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
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
  },
  "token": {
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
  "success": true,
  "files": [
    {
      "_id": "QmSPuRGsDB13kSyGKciYb59zzfRUqCkFRVE6VFm4hskSSL",
      "offer": [
        0,
        1
      ],
      "key": {
        "type": "Buffer",
        "data": [
          72,
          70,
          105,
          83,
          50,
          45,
          7,
          206,
          22,
          147,
          199,
          130,
          207,
          47,
          39,
          143
        ]
      },
      "uri": "http://rairipfs:8080/ipfs/QmfUHHWHaT1jCuiMcJGZJG4pdo4A6ddoaZKPz6rbCDeNMA",
      "mainManifest": "stream.m3u8",
      "author": "author NFT",
      "encryptionType": "aes-128-cbc",
      "title": "M89",
      "thumbnail": "1628777087428-545316449",
      "currentOwner": "owner NFT",
      "contract": "contract address",
      "product": 3,
      "description": "Desc 89",
      "creationDate": "2021-08-12T14:04:59.252Z"
    },
    ...
  ]
}
```

## Error Response

**Condition** : If contract address invalid.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "Invalid Contract address"
}
```
