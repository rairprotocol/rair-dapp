# Get products for the contract

Get all products for specific contract

**URL** : `/api/contracts/network/:networkId/:contractAddress/products`

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

**Parameters:**

```json
{
  "networkId": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "contractAddress": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returns found products

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "products": [
    {
      "_id": "610d14c03de2f5001dafc429",
      "soldCopies": 3,
      "sold": false,
      "royalty": 0,
      "name": "The Dark Knight",
      "collectionIndexInContract": 1,
      "contract": "contractId",
      "copies": 4,
      "creationDate": "2021-08-06T10:53:52.441Z"
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
