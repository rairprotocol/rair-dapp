# Pin token metadata to IPFS cloud

Pin token metadata to IPFS cloud

**URL** : `/api/nft/network/:networkId/:contract/:product/token/:token/pinning`

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
  "contract": {
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
  },
  "token": {
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
