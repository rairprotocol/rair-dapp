# Create a favorite token

**URL** : `/api/favorites/`
**Method** : `POST`

**Body Parameters:**
```json
{
    "token": { "required": true , "content": { "type": "string" } },
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
        "doc": {
            "userAddress": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "token": "64ff4a1d57d24b6bb5e809c1",
            "_id": "6601bfd97f2f949a695c1180"
        }
    }
}
```