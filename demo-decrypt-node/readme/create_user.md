# Creat User

Adding new user to the database with required data

**URL** : `/api/users`

**Method** : `POST`

**Request body:**

```json
{
  "publicAddress": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "adminNFT": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returns if created successfully

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
    "publicAddress": "some public address",
    "_id": "60a3cd21abe49f001d168767"
  }
}
```
