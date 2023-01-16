# Get token

Respond to a challenge to receive a JWT

**URL** : `/api/auth/validate/`

**Method** : `POST`

**Request Body:**

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
