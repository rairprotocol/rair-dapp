# Request an auth challenge

Request an auth challenge for the given ethereum address. The challenge could be signed and then sent to /auth/:
message/:signature to get a JWT

**URL** : `/api/auth/get_challenge/:MetaAddress`

**Method** : `GET`

**Parameters constraints**

```json
{
  "MetaAddress": {
    "type": "string",
    "required": true
  }
}
```

## Success Response

Returns a challenge for the client to sign with the ethereum private key

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "response": {
    "types": {
      "EIP712Domain": [
        {
          "name": "name",
          "type": "string"
        }
      ],
      "Challenge": [
        {
          "name": "challenge",
          "type": "string"
        }
      ]
    },
    "domain": {
      "name": "RAIR Inc."
    },
    "primaryType": "Challenge",
    "message": {
      "challenge": "0efb69a5d972acdffecd0d24dc7ffe73cfb46fc7e0cf24a0af01c05538669122"
    }
  }
}
```

## Error Response

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "Invalid Ethereum address passed to eth-auth"
}
```
