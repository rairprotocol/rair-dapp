# Update specific token metadata by internal token ID

Update specific token metadata by internal token ID

**URL** : `/api/nft/network/:networkId/:contract/:product/token/:token`

**Method** : `PUT`

**Content-Type** : `application/json`

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
  },
  "token": {
    "required": true,
    "content": {
      "type": "number"
    }
  }
}
```

**Request body:**

```json
{
  "name": "New name",
  "description": "Tratata",
  "artist": "KorN",
  "external_url": "http://some.link",
  "image": "http://some.link",
  "animation_url": "http://some.link",
  "attributes": [
    {
      "trait_type": "ping",
      "value": "pong"
    }
  ]
}
```

## Success Response

Returns if updated successfully

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "token": {
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
