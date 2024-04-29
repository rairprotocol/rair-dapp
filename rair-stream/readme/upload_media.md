# Upload media

Upload the media

**URL** : `/ms/api/v1/media/upload`

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

**Request body:**

```json
{
  "video": {
    "required": true,
    "content": {
      "type": "file"
    }
  },
  "title": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "description": {
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
  "offer": {
    "required": false,
    "content": {
      "type": "array",
      "items": {
        "type": "number"
      }
    }
  },
  "category": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "demo": {
    "required": false,
    "content": {
      "type": "boolean"
    }
  },
  "storage": {
    "required": false,
    "content": {
      "type": "string",
      "variants": ["ipfs", "gcp"]
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
  "result": "[file name]"
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
