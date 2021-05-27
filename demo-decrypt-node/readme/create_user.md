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
  "creationDate": "2021-05-18T14:20:17.957Z",
  "adminNFT": "some token",
  "email": null,
  "firstName": null,
  "lastName": null,
  "key": "zw5Ne122KxV2CSr_4HYKu",
  "publicAddress": "0x679f47db5d0e5ff72d3216a54ed1fbe03465b579",
  "_id": "60a3cd21abe49f001d168767"
}
```
