# Get contracts

Find all contracts for specific user

**URL** : `/api/contracts`

**Method** : `GET`

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

## Success Response

Returns found contracts

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "contracts": [
    {
      "_id": "60d0819870a807001c75164d",
      "title": "SOme title",
      "contractAddress": "contractAddress",
      "blockchain": "0x61",
      "diamond": false
    },
    ...
  ]
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
