# Get specific token by contract, product and internal ID

Get specific token by contract, product and internal ID

**URL** : `/api/v2/tokens/:token`

**Method** : `GET`

**Parameters:**

```json
{
  "token": {
    "required": true,
    "content": {
      "type": "number"
    }
  }
}
```

**Query parameters:**

```json
{
  "networkId": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "contractAddress": {
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

Returns the found token

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "status": "success",
  "data": {
    "doc": {
      "_id": "61489247656bf4001ef56e24",
      "metadataURI": "some  URL",
      "token": 1,
      "ownerAddress": "userAddress",
      "offerPool": 11,
      "offer": 0,
      "contract": "contractAddress",
      "uniqueIndexInContract": 1,
      "isMinted": true,
      "isURIStoredToBlockchain": true,
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
}
```
