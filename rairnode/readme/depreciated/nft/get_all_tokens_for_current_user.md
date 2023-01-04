# Get all tokens for user

Get all tokens which belongs to current user

**URL** : `/api/nft`

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

Returns if found some tokens

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "result": [
    {
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
    },
    ...
  ]
}
```
