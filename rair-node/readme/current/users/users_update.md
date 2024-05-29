# Update info for a user
Only for the user's own information or for anyone if current user is admin

**URL** : `/api/users/:userAddress`
**Method** : `PATCH`

**Parameters**
```json
{
    "publicAddress": { "required": true, "content": { "type": "string" } },
}
```
**Body Parameters**
```json
{
    "nickName": { "required": true, "content": { "type": "string" } },
    "avatar": { "required": true, "content": { "type": "string" } },
    "background": { "required": true, "content": { "type": "string" } },
    "email": { "required": true, "content": { "type": "string" } },
    "firstName": { "required": true, "content": { "type": "string" } },
    "lastName": { "required": true, "content": { "type": "string" } },
    "ageVerified": { "required": true, "content": { "type": "string" } },
    "blocked": { "required": true, "content": { "type": "string" } },
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
        "publicAddress": "0xec30asdd0a3f3ce0a730920dc29d74e441f492c3",
        "nickName": "0xec30asdd0a3f3ce0a730920dc29d74e441f492c3",
        "blocked": false,
        "adminRights": true,
        "superAdmin": true
    }
}
```

**Condition** : User not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "User not found" }
```
**Condition** : User is not the same as public address
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "You have no permissions for updating user ${publicAddress}." }
```
**Condition** : Data sent matches with the database info
**Code** : `400 BAD REQUEST`
**Content** : 
```json
{ "success": false, "error": true, "message": "Nothing to update" }
```