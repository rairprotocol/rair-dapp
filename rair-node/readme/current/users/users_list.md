# Get list of all users
Admin access required

**URL** : `/api/users/list`
**Method** : `GET`

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "data": [
        {
            "_id": "64c17180a28f4065d5573dd7",
            "email": "test@test.com",
            "publicAddress": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "creationDate": "2023-07-26T19:18:24.390Z",
            "nickName": "0xec30759d0a3f3ceccc30920dc29ccca41f492c3",
            "blocked": false
        },
        {
            "_id": "659847d68135538357f16221",
            "email": null,
            "publicAddress": "0x44e57410df48ff263e5f5bbde076c07ba7701b3c",
            "creationDate": "2024-01-05T18:17:58.572Z",
            "nickName": "0x44e57410df48ff263ecccbbde07cc07ba7701b3c",
            "blocked": false
        },
    ]
}
```