# Pin token metadata to IPFS cloud

Pin token metadata to IPFS cloud

**URL** : `/api/v2/tokens/:token`

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
  "token": {
    "required": true,
    "content": {
      "type": "number"
    }
  }
}
```

**Query parameters:**

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

Returns if pinned successfully

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "metadataURI": "https://some.url"
}
```
