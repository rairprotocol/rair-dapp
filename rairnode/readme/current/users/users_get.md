# Get information about a single user

**URL** : `/api/users/:userAddress`
**Method** : `GET`

**Parameters**
```json
{
    "publicAddress": { "required": true, "content": { "type": "string" } },
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
        "ageVerified": false,
        "publicAddress": "0xec30asdd0a3f3ce0a730920dc29d74e441f492c3",
        "nickName": "0xec30asdd0a3f3ce0a730920dc29d74e441f492c3",
        "blocked": false,
        "adminRights": true,
        "superAdmin": true
    }
}
```