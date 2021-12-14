# Search

searching by files, products, users

**URL** : `/api/search`

**Method** : `POST`

**Request body:**

```json
{
  "searchString": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "searchBy": {
    "required": false,
    "content": {
      "type": "string",
      "variants": ["users", "products", "files"]
    }
  },
  "blockchain": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "category": {
    "required": false,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returned result depend on what `searchBy` was requested

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "result": []
}
```
