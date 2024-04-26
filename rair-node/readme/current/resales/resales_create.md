# Create a resale offer

**URL** : `/api/resales/create`
**Method** : `POST`

**Body Parameters**
```json
{
    "contract": { "required": false, "content": { "type": "string" } },
    "blockchain": { "required": false, "content": { "type": "string" } },
    "index": { "required": false, "content": { "type": "string" } },
    "price": { "required": false, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "offer": {
        "tokenContract": "64ff3f5e57d24b6bb5e45090",
        "tokenIndex": "0",
        "price": "333000000000000000000",
        "seller": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
        "_id": "6602c66c73383a73912cf7b9"
    }
}
```