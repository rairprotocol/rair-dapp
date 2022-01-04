# Update Admin Token

Verify the user holds the current Admin token and then replace it with a new token

**URL** : `/api/auth/new_admin/:MetaMessage/:MetaSignature/`

**Method** : `POST`

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

**Request body:**

```json
{
  "adminNFT": {
    "description": "Admin token",
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "message": "New NFT set!"
}
```

OR

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": false,
  "message": "You don't hold the current admin token"
}
```

OR

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": false,
  "message": "There was an error validating your request"
}
```

## Error Response

**Condition** : If Ethereum account not found.

**Code** : `400 BAD REQUEST`

**Content** :

OR

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "Could not verify account"
}
```

OR

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "Invalid Ethereum address passed to eth-auth"
}
```
