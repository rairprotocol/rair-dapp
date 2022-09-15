# Get all locks for specific product

Find all locks for specific product

**URL** : `/api/v2/locks`

**Method** : `GET`

**Query parameters:**

```json
{
  "contractId": {
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
  "status": "success",
  "results": 1,
  "data": {
    "doc": [
      {
        "range": [
          "0",
          "49"
        ],
        "_id": "62c1ded73d0b4e9133e09762",
        "lockIndex": "0",
        "contract": "62c1dec53d0b4e9133e096f7",
        "product": "0",
        "lockedTokens": "0",
        "isLocked": true
      },
      ...
    ]
  }
}
```
