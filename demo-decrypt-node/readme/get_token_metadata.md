# Get token metadata

Get token metadata by contract name, product name, offer name and token ID

**URL** : `/api/:contractName/:productName/:offerName/:tokenId`

**Method** : `GET`

**Request parameters:**

```json
{
  "contractName": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "productName": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "offerName": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "tokenId": {
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
  "metadata": {
    "artist": "Michael Visconte",
    "external_url": "none",
    "name": "Ｍａｒｉｌｙｎ░Ｍｏｎｒｏｅ░＃9",
    "description": "The Flag Marilyn. Salute the troops with this playful take on the classic flag layout. ",
    "image": "Marilyn-Monroe-10",
    "attributes": [
      {
        "trait_type": "Quadrants",
        "value": "3"
      },
      {
        "trait_type": "Accent1",
        "value": "Green"
      },
      {
        "trait_type": "Accent2",
        "value": "Blue"
      },
      {
        "trait_type": "Accent3",
        "value": "Brown"
      },
      {
        "trait_type": "Accent4",
        "value": "Null"
      },
      {
        "trait_type": "Itch Years",
        "value": "9"
      },
      {
        "trait_type": "Medium ",
        "value": "Oil on Canvas?"
      }
    ]
  }
}
```
