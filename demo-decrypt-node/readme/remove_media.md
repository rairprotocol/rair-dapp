# Remove media

Register a new piece of media. Optinally provide a decrypt key

**URL** : `/api/media/remove/:mediaId`

**Method** : `DELETE`

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
  "mediaId": {
    "description": "The IPFS content identifier (CID) for a RAIR compatible media folder. Must contain a rair.json manifest.",
    "type": "string",
    "required": true
  }
}
```

## Success Response

Returns if media successfully found and deleted

**Code** : `200 OK`

## Error Response

**Condition** : Media not belong to specified user.

**Code** : `403 FORBIDDEN`

**Content** :

```json
{
  "success": false,
  "message": "You don't have permission to manage this file."
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
