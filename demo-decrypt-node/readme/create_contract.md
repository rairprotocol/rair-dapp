# Creat Contract

Adding new contract by user

**URL** : `/api/contracts`

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
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "blockchain": {
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
  },
  "copies": {
    "required": true,
    "content": {
      "type": "number"
    }
  },
  "royalty": {
    "required": true,
    "content": {
      "type": "number"
    }
  },
  "license": {
    "required": true,
    "content": {
      "type": "boolean"
    }
  },
  "price": {
    "required": true,
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
