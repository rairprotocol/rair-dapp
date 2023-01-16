# Get products for the user

Get product by ID

**URL** : `/api/v2/contracts/:contractId`

**Method** : `GET`

**Parameters:**

```json
{
  "contractId": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
}
```
## Returns found contract

```json
{
    "success": true,
    "contract": {
        "_id": "629f308eb550f7001d6ee2cf",
        "title": "mike_test_001",
        "blockchain": "0x5",
        "contractAddress": "0x205399b10bce421ecc6313a393c11f8083cd056f",
        "diamond": false
    }
}
```
No specific error handling
