# Upload media

Upload the media

**URL** : `/api/media/upload`

**Method** : `POST`

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
  "contractAddress": {
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
