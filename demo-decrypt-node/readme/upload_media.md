# Upload media

Upload the media

**URL** : `/api/media/upload`

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

**Request body:**

```json
{
  "title": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "description": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "contractAddress": {
    "required": false,
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
