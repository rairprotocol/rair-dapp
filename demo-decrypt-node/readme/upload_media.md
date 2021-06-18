# Upload media

Upload the media

**URL** : `/api/media/upload`

**Method** : `POST`

**Request body:**

```json
{
  "title": {
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
  "token":  {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "author": {
    "required": false,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returns if added successfully

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "result": "[file name]"
}
```
