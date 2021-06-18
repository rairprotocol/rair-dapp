# Get User details

Get User information by the token

**URL** : `/api/auth/user_info?token=sometoken`

**Method** : `GET`

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

## Success Response

Returns if sent valid token

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
    "publicAddress": "some public address",
    "_id": "60a3cd21abe49f001d168767"
  }
}
```

## Error Response

**Condition** : If user not found.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** : "User with provided Token is not found in database"

OR

**Condition** : If token not valid.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** : "jwt malformed"

OR

**Condition** : If token expired.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** : "jwt expired"
