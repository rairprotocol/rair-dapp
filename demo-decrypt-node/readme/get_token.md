# Get token

Respond to a challenge to receive a JWT

**URL** : `/api/auth/get_token/:MetaMessage/:MetaSignature/:mediaId`

**Method** : `GET`

**Parameters:**

```json
{
  "MetaMessage": {
    "description": "The previously issued challenge,",
    "type": "string",
    "required": true
  },
  "MetaSignature": {
    "description": "The user's signature for the provided message",
    "type": "string",
    "required": true
  },
  "mediaId": {
    "description": "The Id of media that an access token is being requested for",
    "type": "string",
    "required": true
  }
}
```

## Success Response

If the signer meets the requirments (signature valid, holds required token) returns a JWT which grants stream access.

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldGhfYWRkciI6IjB4Njc5ZjQ3ZGI1ZDBlNWZmNzJkMzIxNmE1NGVkMWZiZTAzNDY0YTU3OSIsIm1lZGlhX2lkIjoiUW1kS2RBWk5WSG4xcGlCR1VFWFREUjJDU1drYzNyRXQzQWdGMzk5NEJzRXZ0cCIsImlhdCI6MTYxNzg3OTM4OCwiZXhwIjoxNjE3OTY1Nzg4fQ.9V9sGPcQCavJYGUP7Gm5WhgSln-4Xz4MwV5ocXNKDyc"
}
```

## Error Response

**Condition** : If Ethereum account not found.

**Code** : `400 BAD REQUEST`

OR

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": true,
  "error": true,
  "message": "Account does not hold required token [nftIdentifier]"
}
```

OR

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": true,
  "error": true,
  "message": "Could not verify account"
}
```

OR

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": true,
  "error": true,
  "message": "Could not create JWT"
}
```

OR

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": true,
  "error": true,
  "message": "Invalid Ethereum address passed to eth-auth"
}
```
