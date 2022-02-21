# Get full contracts

Find all contracts with all products and offers on the platform

**URL** : `/api/contracts/full`

**Method** : `GET`

**Query parameters:**

```json
{
  "pageNum": {
    "required": false,
    "content": {
      "type": "number"
    }
  },
  "itemsPerPage": {
    "required": false,
    "content": {
      "type": "number"
    }
  },
  "blockchain": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "category": {
    "required": false,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returns found full contracts

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "contracts": [
    {
      "_id": "6148912f656bf4001ef56e08",
      "user": "address of user",
      "title": "Contract 1",
      "contractAddress": "contractId",
      "blockchain": "0x61",
      "creationDate": "2021-09-20T13:48:31.700Z",
      "products": {
        "_id": "61489163656bf4001ef56e0d",
        "soldCopies": 5,
        "sold": false,
        "royalty": 0,
        "name": "Product 1.1",
        "collectionIndexInContract": 0,
        "contract": "contractId",
        "copies": 500,
        "firstTokenIndex": 0,
        "creationDate": "2021-09-20T13:49:23.781Z",
        "offers": [
          {
            "_id": "614891fc656bf4001ef56e10",
            "soldCopies": 5,
            "sold": false,
            "range": [
              0,
              10
            ],
            "offerName": "Offer 1.1.1",
            "offerIndex": 0,
            "contract": "contractId",
            "product": 0,
            "offerPool": 11,
            "price": 111,
            "creationDate": "2021-09-20T13:51:56.246Z",
            "copies": 11
          },
          {
            "_id": "614891fc656bf4001ef56e12",
            "soldCopies": 0,
            "sold": false,
            "range": [
              11,
              50
            ],
            "offerName": "Offer 1.1.2",
            "offerIndex": 1,
            "contract": "contractId",
            "product": 0,
            "offerPool": 11,
            "price": 55,
            "creationDate": "2021-09-20T13:51:56.250Z",
            "copies": 40
          }
        ]
      },
      "offerPool": {
        "_id": "618e82eb23dc5b001d58946e",
        "marketplaceCatalogIndex": 12,
        "contract": "contractId",
        "product": 0,
        "rangeNumber": 1,
        "minterAddress": "minterAddress",
        "creationDate": "2021-11-12T15:06:19.756Z"
      }
    },
    ...
  ],
  "totalNumber": 12
}
```
