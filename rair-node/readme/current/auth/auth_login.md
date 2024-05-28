# Login using the signed message
Authentication functionality for Web3 wallets and Web3Auth smart accounts

**URL** : `/api/auth/login`
**Method** : `POST`

**Body Parameters:**
```json
{
    "MetaMessage": { "required": true , "content": { "type": "string" } },
    "MetaSignature": { "required": true , "content": { "type": "string" } },
    "ownerAddress": { "required": false , "content": { "type": "string" } },
    "userAddress": { "required": false , "content": { "type": "string" } },
    "mediaId": { "required": false , "content": { "type": "string" } },
    "zoomId": { "required": false , "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "user": {
        "email": "example@rair.com",
        "avatar": "https://storage.googleapis.com/rair_images/user.jpeg",
        "background": null,
        "firstName": null,
        "lastName": null,
        "ageVerified": true,
        "publicAddress": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
        "nickName": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
        "blocked": false,
        "adminRights": true,
        "superAdmin": true
    }
}
```

## Error Response
**Condition** : Missing values in body
**Code** : `400 BAD REQUEST`
**Content** : 
```json
{ "success": false, "error": true, "message": "Error in web3Auth login" }
```
**Condition** : User not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "User not found" }
```
**Condition** : Web3 verification failed
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "Authentication failed" }
```