# Get full contracts

Find all contracts with all products and offers on the platform
Actually this EP works with products, but starts on contract level 
  *this can be changed

*V1 to V2 Note*
This EP brings together v1 EP:
  -/api/contracts/full
    to achive similar response use default parametrs (as v1)
  -/api/contracts/network/:networkId/:contractAddress/products
    to achive similar response use next query parameters: 
      - contractAddress - Contract you search address (hash)
      - blockchain - blockchain prefix like '0x5'
      -| (in alternative to contract address + blockchain) contractId (objectID as in DB)
      - addOffers - 0
      - addLocks - 0
  -/api/contracts/network/:networkId/:contractAddress/products/offers
    to achive similar response use next query parameters: 
      - contractAddress - Contract you search address (hash)
      - blockchain - blockchain prefix like '0x5'
      -| (in alternative to contract address + blockchain) contractId (objectID as in DB)
      - addOffers - 1
      - addLocks - 1

**URL** : `/api/v2/contracts/full`

**Method** : `GET`

**Query parameters:**

  "category" removed on V2


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
  "contractAddress": {
    "required": false,
    "content": {
      "type": "string"
    },},
  
  "contractId": {
    "required": false,
    "content": {
      "type": "string"
    },},
  
  "addOffers":{ 
    "required": false,
    "content": {
      "type": "number" // use as bool 0 and 1
    },},
  
  "addLocks": {
    "required": false,
    "content": {
      "type": "number" // use as bool 0 and 1
    },},
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
