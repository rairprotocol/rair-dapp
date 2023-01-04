# Get list of favorites token

Get list of favorites token for current user

**URL** : `/api/v2/favorites`

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

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "doc": [
      {
        "_id": "62f3f9f71e4e6f001caa0630",
        "token": {
          "metadataURI": "none",
          "authenticityLink": "none",
          "isURIStoredToBlockchain": false,
          "_id": "62dff1566ac9d9001d16715b",
          "contract": "62c2ce277c4979001c9d0672",
          "token": "3",
          "offerPool": "146",
          "ownerAddress": "0xooooooooooooooooooooooooooooooooooo3",
          "offer": "0",
          "uniqueIndexInContract": "103",
          "isMinted": false,
          "metadata": {
            "image": "imageLink",
            "artist": "NameOfArtist",
            "external_url": "link",
            "description": "some description",
            "name": "name",
            "attributes": [
              {
                "trait_type": "Rarity",
                "value": "Black and White"
              },
              ...
            ],
            "animation_url": ""
          },
          "isMetadataPinned": false,
          "creationDate": "2022-07-26T13:51:18.897Z"
        },
        "userAddress": "publicAddress"
      },
      ...
    ]
  }
}
```
