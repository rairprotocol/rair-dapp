# Get All Product token numbers

Get tokens for the product

**URL** : `/api/nft/network/:networkId/:contract/:product/tokenNumbers`

**Method** : `GET`

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
  }
}
```

## Success Response

Returns if found some tokens

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "tokens": [
    0,
    1,
    ...,
    999
  ]
}
```
