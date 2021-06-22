# Update Contract

Updating some fields of the specific contract

**URL** : `/api/contracts/:contractAddress`

**Method** : `PUT`

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
  "contractAddress": {
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
    "content": {
      "type": "string"
    }
  },
  "royalty": {
    "content": {
      "type": "number"
    }
  },
  "price": {
    "content": {
      "type": "number"
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
  "contract": {
    "_id": "60d0819870a807001c75164d",
    "user": "user NFT",
    "title": "test contract 1",
    "blockchain": "some data in blockchain",
    "contractAddress": "contractAddress",
    "copies": 1000,
    "royalty": 30,
    "license": true,
    "price": 0.001,
    "creationDate": "2021-06-21T12:10:00.623Z"
  }
}
```
