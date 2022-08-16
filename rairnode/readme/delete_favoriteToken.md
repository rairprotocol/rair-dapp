# Remove favorite token

Remove favorite token for current user from DB

**URL** : `/api/v2/tokens/favorite/:id`

**Method** : `DELETE`

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

**Query parameters:**

```json
{
  "id": {
    "required": true,
    "content": {
      "type": "string",
      "description": "id of favorite in DB"
    }
  }
}
```

## Success Response

Returns if remove successfully

**Code** : `204 OK`

