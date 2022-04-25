# Get all locks for specific product

Find all locks for specific product

**URL** : `/api//transaction/:network/:hash`

**Method** : `GET`

**Parameters:**

```json
{
  "network": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "hash": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returns an array of events found and parsed

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "result": [
    {
      "eventSignature": "CreatedCollection(uint256,string,uint256,uint256)",
      "arguments": [...],
      "transactionHash": "0x0f28d1c7f09e033b1cc51b363503cd5f0f9ed4c8",
      "blockNumber": 0
    }
    ...
  ]
}
```
