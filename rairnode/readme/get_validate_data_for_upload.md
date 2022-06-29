Validate data for upload video

**URL** : `/api/v2/upload/validate`

**Method** : `GET`

**Request parameters:**

```json
{
  "contract": {
    "required": true,
    "content": {
      "type": "string"
    },
    "description": "contract ID"
  },
  "product": {
    "required": true,
    "content": {
      "type": "number"
    }
  },
  "offer": {
    "required": false,
    "content": {
      "type": "array",
      "items": {
        "type": "number"
      }
    }
  },
  "category": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "demo": {
    "required": false,
    "content": {
      "type": "boolean"
    }
  }
}
```

## Success Response

Return founded categoy $ product

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "foundContract": "629f36b768a821001c4b37ea",

  "foundCategory": { 
    "_id": "62948796558076001e29bb5d",
    "name": "Art" 
    }
}
```