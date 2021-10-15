# Store authenticity link

Store authenticity link for specific token

**URL** : `/api/nft/:contract/offerPool/:offerPool/token/:token`

**Method** : `POST`

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

**Parameters:**

```json
{
  "contract": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "offerPool": {
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

**Request body:**

```json
{
  "link": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returns if created successfully

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "result": {
    "_id": "61695aae9097df001c940fd8",
    "link": "https://www.google.com/",
    "token": 1,
    "offerPool": 11,
    "contract": "contractAddress",
    "creationDate": "2021-10-15T10:40:46.997Z"
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
