# Update specific token metadata by internal token ID

Update specific token metadata by internal token ID

**URL** : `/api/nft/network/:networkId/:contract/:product/token/:token`

**Method** : `POST`

**Content-Type** : `multipart/form-data`

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
  "files": {
    "required": false,
    "content": {
      "type": "array",
      "items": {
        "type": "file"
      }
    }
  },
  "name": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "description": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "artist": {
    "required": false,
    "content": {
      "type": "string"
    },
    "description": "contract ID"
  },
  "external_url": {
    "required": false,
    "content": {
      "type": "URI"
    }
  },
  "image": {
    "required": false,
    "content": {
      "type": "full name of file"
    }
  },
  "animation_url": {
    "required": false,
    "content": {
      "type": "full name of file"
    }
  },
  "attributes": {
    "required": false,
    "content": {
      "type": "array",
      "items": {
        "type": "object",
        "fields": {
          "trait_type": {
            "type": "string"
          },
          "value": {
            "type": "string"
          }
        }
      }
    }
  }
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
```
