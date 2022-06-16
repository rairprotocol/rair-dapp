# Pinn multiple tokens to the cloud

Upload multiple tokens metadata to the cloud, with unique tokens metadata or with common metadata for batch of tokens.

**URL** : `/api/nft/pinningMultiple`

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
  "contractId": 1,
  "product": 1
}
```

## Success Response

Returns if found some tokens

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

If each token have unique metadata

```json
{
  "success": true
}
```

If tokens have common metadata

```json
{
  "success": true,
  "metadataURI": "link to metadata"
}
```
