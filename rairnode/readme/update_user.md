# Update User

Updating specific user

**URL** : `/api/users/:publicAddress`

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

**Request parameters:**

```json
{
  "publicAddress": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

**form-data:**

```json
{
  "file": {
    "required": false,
    "content": {
      "type": "image file"
    }
  },
  "nickName": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "avatar": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "email": {
    "required": false,
    "content": {
      "type": "string"
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
  "user": {
    "email": null,
    "avatar": null,
    "firstName": null,
    "lastName": null,
    "_id": "61af976dc4444d001c98d851",
    "publicAddress": "publicAddress",
    "nonce": "some_string",
    "creationDate": "2021-12-07T17:18:37.231Z",
    "nickName": "@Test"
  }
}
```
