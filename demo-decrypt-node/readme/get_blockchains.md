# Get blockchains

List of all blockchains supported on platform

**URL** : `/api/blockchains`

**Method** : `GET`

## Success Response

Returns a list of blockchains

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "blockchains": [
    {
      "_id": "61b0d2775f0a55001c272658",
      "name": "Binance Testnet",
      "hash": "0x61"
    },
    {
      "_id": "61b0d2775f0a55001c272659",
      "name": "Goerli Testnet",
      "hash": "0x5"
    },
    {
      "_id": "61b0d2775f0a55001c27265a",
      "name": "Matic Mainnet",
      "hash": "0x89"
    },
    {
      "_id": "61b0d2775f0a55001c27265b",
      "name": "Matic Mumbai Testnet",
      "hash": "0x13881"
    }
  ]
}
```
