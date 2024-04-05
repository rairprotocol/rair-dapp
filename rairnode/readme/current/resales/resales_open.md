# Get list of all open offers

**URL** : `/api/resales/open`
**Method** : `GET`

**Query Parameters**
```json
{
    "contract": { "required": false, "content": { "type": "string" } },
    "blockchain": { "required": false, "content": { "type": "string" } },
    "index": { "required": false, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "data": [
        {
            "_id": "6539da4c689a23388e337258",
            "tokenContract": "64ff440357d24b6bb5e67342",
            "tokenIndex": "1001",
            "price": "90000000000000000",
            "seller": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "__v": 0
        },
        {
            "_id": "654298953c7d75af9eba91d4",
            "tokenContract": "6541442aa83090be43bccd74",
            "tokenIndex": "1",
            "price": "10000000000000000",
            "seller": "0x43f2fe4b1ce105f9fa5c10b7f2c072c4dcb709ae",
            "__v": 0
        },
        {
            "_id": "6549bb98121f0afdc5f53e2b",
            "tokenContract": "6541442aa83090be43bccd74",
            "tokenIndex": "0",
            "price": "1000000000000000",
            "seller": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "__v": 0
        },
        {
            "_id": "655bbc5baf1cfb69c71d4d50",
            "tokenContract": "64ff3f5e57d24b6bb5e45090",
            "tokenIndex": "5",
            "price": "10000000000000000",
            "seller": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "__v": 0
        },
        {
            "_id": "65c7dbd9e128d5b78a858d80",
            "tokenContract": "64ff440357d24b6bb5e67342",
            "tokenIndex": "410",
            "price": "230000000000000000",
            "seller": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "__v": 0
        }
    ]
}
```