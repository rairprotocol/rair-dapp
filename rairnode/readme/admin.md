# Verify admin user

Verify with a Metamask challenge if the user holds the current Administrator token

**URL** : `/api/auth/admin/:MetaMessage/:MetaSignature/`

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

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "message": "Admin token holder"
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

## Error Response

**Condition** : If the account don't have passed tokens

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
