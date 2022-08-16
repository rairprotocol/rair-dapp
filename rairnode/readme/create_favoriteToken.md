# Store favorite token

Store favorite token for current user in DB

**URL** : `/api/v2/tokens/favorite`

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
  "token": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returns if created successfully

**Code** : `201 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "status": "success",
  "data": {
    "doc": {
      "_id": "62f3fc41f208d6001c1bea22",
      "token": "62dff1566ac9d9001d16715e",
      "userAddress": "publicAddress"
    }
  }
}
```
