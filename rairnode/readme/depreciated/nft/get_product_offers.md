# Get specific product with all offers

Find product with all offers

**URL** : `/api/nft/network/:networkId/:contract/:product/offers`

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

Returns found product with offers

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "product": {
    "_id": "610d14c03de2f5001dafc429",
    "soldCopies": 3,
    "sold": false,
    "royalty": 0,
    "name": "The Dark Knight",
    "collectionIndexInContract": 1,
    "contract": "contractAddress",
    "copies": 4,
    "owner": "userAddress",
    "creationDate": "2021-08-06T10:53:52.441Z",
    "offers": [
      {
        "_id": "610d15043de2f5001dafc42e",
        "soldCopies": 2,
        "sold": true,
        "range": [
          0,
          1
        ],
        "offerIndex": 0,
        "contract": "contractAddress",
        "product": 1,
        "offerPool": 21,
        "price": 111,
        "offerName": "Some Name 1",
        "creationDate": "2021-08-06T10:55:00.621Z",
        "copies": 2
      },
      {
        "_id": "610d15983de2f5001dafc432",
        "soldCopies": 1,
        "sold": false,
        "range": [
          2,
          3
        ],
        "offerIndex": 1,
        "contract": "contractAddress",
        "product": 1,
        "offerPool": 21,
        "price": 55,
        "offerName": "Some Name 2",
        "creationDate": "2021-08-06T10:57:28.313Z",
        "copies": 2
      }
    ]
  }
}
```
