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
      "metadataURI": "none",
      "_id": "6148922b656bf4001ef56e1b",
      "token": 0,
      "ownerAddress": "ownerAddress",
      "offerPool": 11,
      "offer": 0,
      "contract": "contractAddress",
      "uniqueIndexInContract": 0,
      "isMinted": true,
      "creationDate": "2021-09-20T13:52:43.804Z"
    },
    {
      "metadataURI": "metadataURI",
      "_id": "61489247656bf4001ef56e24",
      "token": 1,
      "ownerAddress": "ownerAddress",
      "offerPool": 11,
      "offer": 0,
      "contract": "contractAddress",
      "uniqueIndexInContract": 1,
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
            "trait_type": "",
            "value": ""
          }
        ],
        "name": "CoinAgenda Monaco 2021 #1",
        "description": "Stream the conference",
        "image": "coinagendamonaco1"
      },
      "creationDate": "2021-09-20T13:53:11.567Z"
    },
    ...
  ]
}
```
