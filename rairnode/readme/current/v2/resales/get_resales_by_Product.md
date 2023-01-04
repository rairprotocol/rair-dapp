

# Get resale tokens by offer

Find all resale tokens for a provided offer

**URL** : `api/v2/resales/byOffer/:offerId`

**Method** : `GET`

**Parameters:**

```json
{
  "offerId": {
    "required": true,
    "content": {
      "type": "ObjectId"
    }
  }
}
```

## Success Response

Returns found resale items

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**


```json
{
    "success": true,
    "data": [
        {
            "_id": "62c42e4b9b9721001d5ad197",
            "operator": "testOperator",
            "tokenId": "0",
            "price": "101",
            "status": "Open",
            "tradeid": "0",
            "__v": 0,
            "contract": "626bc93f3a67b03f7001c3cd"
        },
        {
            "_id": "62c4394fef2fa7001cc3e179",
            "operator": "testOperator",
            "contract": "626bc93f3a67b03f7001c3cd",
            "tokenId": "0",
            "price": "101",
            "status": "Open",
            "tradeid": "0",
            "__v": 0
        }
    ]
}
```