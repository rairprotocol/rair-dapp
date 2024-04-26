# Search functionality
Look through Products, Contracts and Users

**URL** : `/api/search/:textParam`
**Method** : `GET`

**Query Parameters**
```json
{
    "textParam": { "required": false, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "data": {
        "users": [
            {
                "_id": "65df57bf25445516c2b25afb",
                "avatar": null,
                "publicAddress": "0xba300be4fcbdc581b0086bc4cb2d0da1d00fa025",
                "nickName": "@abc"
            },
            {
                "_id": "659ea25178fd683cff0ba153",
                "avatar": null,
                "publicAddress": "0xd4f8e7074e604edad5fda10048c6d3a603ec7ae4",
                "nickName": "@abc3"
            },
            {
                "_id": "65f1c98ba5659d1cefb1b1a8",
                "avatar": null,
                "publicAddress": "0xdd72d05e5c52bb73c2d42ddb30bd381e11279917",
                "nickName": "@abc12"
            }
        ],
        "products": [],
        "tokens": []
    }
}
```

**Condition** : Nothing found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Nothing found" }
```