# Get full product

Get full data about particular product and get list of tokens for it

**URL** : `/api/:contractId/:productIndex`

**Method** : `GET`

**Request parameters:**

```json
{
  "contractId": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "productIndex": {
    "required": true,
    "content": {
      "type": "number"
    }
  }
}
```

## Success Response

Returns founded user

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "result": {
    "contract": {
      "_id": "6149eeea440c69001dc2c500",
      "user": "0x679f47db5d0e5ff72d3216a54ed1fbe03464a579",
      "title": "Contract 2",
      "contractAddress": "contractAddress",
      "blockchain": "BNB",
      "creationDate": "2021-09-21T14:40:42.185Z",
      "products": {
        "_id": "615cb87f12aed2001c49c740",
        "soldCopies": 1,
        "sold": false,
        "royalty": 0,
        "cover": "none",
        "name": "Product 2.1",
        "collectionIndexInContract": 0,
        "contract": "contractAddress",
        "copies": 300,
        "firstTokenIndex": 0,
        "creationDate": "2021-10-05T20:41:35.632Z",
        "offers": [
          {
            "_id": "6149efa7440c69001dc2c503",
            "soldCopies": 1,
            "sold": false,
            "range": [
              0,
              10
            ],
            "offerName": "Offer 2.1.1",
            "offerIndex": 0,
            "contract": "contractAddress",
            "product": 0,
            "offerPool": 14,
            "price": 88,
            "creationDate": "2021-09-21T14:43:51.589Z",
            "copies": 11
          },
          ...
        ]
      }
    },
    "tokens": [
      {
        "metadataURI": "none",
        "_id": "61601da5624323001d7fc442",
        "token": 0,
        "ownerAddress": "publicAddress",
        "offerPool": 14,
        "offer": 0,
        "contract": "contractAddress",
        "uniqueIndexInContract": 0,
        "isMinted": true,
        "metadata": {
          "artist": "chrissweet",
          "external_url": "none",
          "attributes": [
            {
              "trait_type": "Crystal Color",
              "value": "Pink"
            },
            {
              "trait_type": "Suit Color",
              "value": "Black"
            },
            {
              "trait_type": "Background Color",
              "value": "Original"
            },
            {
              "trait_type": "Speaker",
              "value": "TRUE"
            },
            {
              "trait_type": "Sponsor",
              "value": "TRUE"
            },
            {
              "trait_type": "Staff",
              "value": "FALSE"
            },
            {
              "trait_type": "Attendee",
              "value": "TRUE"
            },
            {
              "trait_type": "Original Owner",
              "value": "Charles Hoskinson"
            },
            {
              "trait_type": "External URL rair.market/0/factory/product/URI",
              "value": "url"
            },
            {
              "trait_type": "",
              "value": ""
            }
          ],
          "name": "CoinAgenda Monaco 2021 #1",
          "description": "description",
          "image": "coinagendamonaco1"
        },
        "creationDate": "2021-10-08T10:29:57.553Z"
      },
      ...
    ],
    "totalCount": 28
  }
}
```
