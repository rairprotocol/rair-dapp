# Get information about current user (from session)
Only available for web3 wallet users

**URL** : `/api/auth/me`
**Method** : `GET`

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