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
    "email": null,
    "avatar": null,
    "firstName": null,
    "lastName": null,
    "_id": "61af976dc4444d001c98d851",
    "publicAddress": "publicAddress",
    "nonce": "some_string",
    "creationDate": "2021-12-07T17:18:37.231Z",
    "nickName": "publicAddress_by_default"
  }
}
```
