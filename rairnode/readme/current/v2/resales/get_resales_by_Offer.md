
# Get resale tokens by product

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
            "_id": "62c443a6506169001d9165c8",
            "operator": "testOperator",
            "contract": "626bc93f3a67b03f7001c3cd",
            "tokenId": "12",
            "price": "101",
            "status": "Open",
            "tradeid": "0",
            "__v": 0
        },
        {
            "_id": "62c443a9506169001d9165ca",
            "operator": "testOperator",
            "contract": "626bc93f3a67b03f7001c3cd",
            "tokenId": "42",
            "price": "101",
            "status": "Open",
            "tradeid": "0",
            "__v": 0
        }
    ]
}
```