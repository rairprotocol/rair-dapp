# Get User

Get single user by public address

**URL** : `/api/users/:publicAddress`

**Method** : `GET`

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

## Success Response

Returns founded user

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "user": {
    "creationDate": "2021-05-18T14:20:17.957Z",
    "email": null,
    "firstName": null,
    "lastName": null,
    "key": "zw5Ne122KxV2CSr_4HYKu",
    "publicAddress": "0x679f47db5d0e5ff72d3216a54ed1fbe03465b579",
    "_id": "60a3cd21abe49f001d168767"
  }
}
```
