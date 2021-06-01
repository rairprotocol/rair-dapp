# Verification of user signature

Verification of user signature, updating secret kye and generating of JWT token

**URL** : `/api/auth/authentication`

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
  "signature": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returns if verification passed successfully

**Code** : `200 OK`

**Content-Type**: `text/html`

**Content example**

```json
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldGhfYWRkciI6IjB4Njc5ZjQ3ZGI1ZDBlNWZmNzJkMzIxNmE1NGVkMWZiZTAzNDY0YTU3OSIsImlhdCI6MTYyMjExNDQ4MiwiZXhwIjoxNjIyMjAwODgyfQ.B43GmgXyBShHTa1qLK5Ozo_7UcHzZp4HlfFISzhp24I
```

## Error Response

**Condition** : If user not found.

**Code** : `404 NOT FOUND`

**Content** : "User with publicAddress 123 is not found in database"

OR

**Condition** : If decrypted public address not equal to user address.

**Code** : `401 UNAUTHORIZED`

**Content** : "Signature verification failed"
