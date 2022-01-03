# Get all locks for specific product

Find all locks for specific product

**URL** : `/api/nft/:contract/:product/locks`

**Method** : `GET`

**Parameters:**

```json
{
  "contract": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "product": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returns found locks for specific product

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "locks": [
    {
      "range": [
        120,
        129
      ],
      "_id": "61966fb6bf7dc9001c9ce86a",
      "lockIndex": 0,
      "contract": "contractAddress",
      "product": 3,
      "lockedTokens": 2,
      "isLocked": true
    },
    ...
  ]
}
```
