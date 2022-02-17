# Creat Bunch of tokens

Adding new or updating existed lazy minted tokens from csv file

**URL** : `/api/nft`

**Method** : `POST`

**Content-Type** : `multipart/form-data`

**Headers:**

```json
{
  "x-rair-token": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

**form-data:**

```json
{
  "csv": {
    "required": true,
    "content": {
      "type": "csv file"
    }
  },
  "blockchain": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "contract": {
    "required": true,
    "content": {
      "type": "string"
    },
    "description": "contract ID"
  },
  "product": {
    "required": true,
    "content": {
      "type": "number"
    }
  },
  "updateMeta": {
    "required": false,
    "content": {
      "type": "boolean"
    }
  },
  "blockchain": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returns if added successfully

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "result": [
    {
      "metadataURI": "none",
      "_id": "613744b194ce62001d2ee7eb",
      "token": "0",
      "ownerAddress": "0xooooooooooooooooooooooooooooooooooo0",
      "offerPool": 29,
      "offer": 0,
      "contract": "contract_address",
      "metadata": {
        "artist": "artist",
        "external_url": "external_url",
        "name": "CoinAgenda Monaco 2021 #0",
        "description": "unique1",
        "image": "speaker.png",
        "attributes": {
          "attribute1": "Speaker",
          "attribute2": "fffffff",
          "attribute3": "john doe"
        }
      },
      "creationDate": "2021-09-07T10:53:37.170Z"
    },
    ...
  ]
}
```

## Error Response

**Condition** : If specified user not have admin rights.

**Code** : `403 FORBIDDEN`

**Content** :

```json
{
  "success": false,
  "message": "You don't have permission to upload the files."
}
```

OR

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
