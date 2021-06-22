# Get Contracts

Find all contracts for specific user

**URL** : `/api/contracts`

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

## Success Response

Returns found contracts

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "contracts": [
    {
      "_id": "60d0819870a807001c75164d",
      "contractAddress": "contractAddress"
    },
    ...
  ]
}
```
