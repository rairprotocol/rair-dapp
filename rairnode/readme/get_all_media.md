# Get all media

List all the registered media, their URIs and encrypted status

**URL** : `/api/media/list`

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
  "pageNum": {
    "required": false,
    "content": {
      "type": "number"
    }
  },
  "itemsPerPage": {
    "required": false,
    "content": {
      "type": "number"
    }
  },
  "blockchain": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "category": {
    "required": false,
    "content": {
      "type": "string"
    }
  }
}
```

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
            "creationDate": "2021-06-21T10:38:34.095Z",
            "isOwner": true
        },
    ...
  }
}
```

## Error Response

**Condition** : If token expired.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "jwt expired"
}
```

OR

**Condition** : If token not valid.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "invalid signature"
}
```

OR

**Condition** : If token not valid.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "jwt malformed"
}
```

OR

**Condition** : If token not provided.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "jwt must be provided"
}
```

OR

**Condition** : If user not found.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "User with provided Token is not found in database"
}
```
