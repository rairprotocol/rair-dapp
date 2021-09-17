# Update User

Updating specific user

**URL** : `/api/users/:publicAddress`

**Method** : `PUT`

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

**Request body:**

```json
{
  "adminNFT": {
    "required": true,
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
    "creationDate": "2021-05-18T14:20:17.957Z",
    "adminNFT": "some token",
    "email": null,
    "firstName": null,
    "lastName": null,
    "key": "zw5Ne122KxV2CSr_4HYKu",
    "publicAddress": "some public address",
    "_id": "60a3cd21abe49f001d168767"
  }
}
```
