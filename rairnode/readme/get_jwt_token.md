# Verification of user

Verification of user Metamask challenge, check admin rights and generating of JWT token

**URL** : `/api/auth/authentication`

**Method** : `GET`

**Parameters:**

```json
{
  "MetaMessage": {
    "type": "string",
    "required": true
  },
  "MetaSignature": {
    "type": "string",
    "required": true
  }
}
```

## Success Response

Returns if verification passed successfully

**Code** : `200 OK`

**Content-Type**: `text/html`

**Content example**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldGhfYWRkciI6IjB4Njc5ZjQ3ZGI1ZDBlNWZmNzJkMzIxNmE1NGVkMWZiZTAzNDY0YTU3OSIsImlhdCI6MTYyMjExNDQ4MiwiZXhwIjoxNjIyMjAwODgyfQ.B43GmgXyBShHTa1qLK5Ozo_7UcHzZp4HlfFISzhp24I"
}
```

## Error Response

**Condition** : If user not found.

**Code** : `404 NOT FOUND`

**Content** : "User with publicAddress 123 is not found in database"

OR

**Condition** : If decrypted public address not equal to user address.

**Code** : `401 UNAUTHORIZED`

**Content** : "Signature verification failed"
