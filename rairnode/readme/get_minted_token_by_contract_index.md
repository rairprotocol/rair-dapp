# Get specific token by contract and unique ID

Get specific token by contract address and unique toke ID in contract

**URL** : `/api/nft/network/:networkId/:contract/token/:tokenInContract`

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
  "tokenInContract": {
    "required": true,
    "content": {
      "type": "number"
    }
  }
}
```

## Success Response

Returns the found token

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "result": {
    "_id": "61489247656bf4001ef56e24",
    "metadataURI": "some  URL",
    "token": 1,
    "ownerAddress": "userAddress",
    "offerPool": 11,
    "offer": 0,
    "contract": "contractAddress",
    "uniqueIndexInContract": 1,
    "isMinted": true,
    "metadata": {
      "artist": "chrissweet",
      "external_url": "none",
      "name": "CoinAgenda Monaco 2021 #1",
      "description": "Stream the conference Link",
      "image": "coinagendamonaco1",
      "attributes": [
        {
          "trait_type": "Crystal Color",
          "value": "Pink"
        },
        ...
      ]
    },
    "creationDate": "2021-09-20T13:53:11.567Z",
    "authenticityLink": "Link"
  }
}
```
