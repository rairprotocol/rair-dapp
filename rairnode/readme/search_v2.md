# Search

searching by tokens, products, users

**URL** : `/api/v2/search/:textParam`

**Method** : `GET`

**Parameters:**

```json
{
  "textParam": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
}
```
## Success Response

Returns found items (3 arrays capped at 4 results)

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**
```json
{
    "success": true,
    "data": {
        "users": [
            {
                "avatar": null,
                "_id": "627ba2c475a9ab001d9bd6af",
                "nickName": "0x2c1b196a2ef816d3ff5c68f22722cc49ea058a42"
            }
        ],
        "products": [
            {
                "_id": "626bcc9c3a67b03f7001cf68",
                "name": "AdminNFT DIamond",
                "collectionIndexInContract": "0",
                "contract": "626bcb973a67b03f7001c915",
                "copies": 5,
                "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW"
            },
            {
                "_id": "626bc9b53a67b03f7001c638",
                "name": "Binance-Test2-Coll1",
                "collectionIndexInContract": "0",
                "contract": "626bc93f3a67b03f7001c3c7",
                "copies": 3,
                "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW"
            },
            {
                "_id": "626bcc943a67b03f7001cf5f",
                "name": "ASDASD",
                "collectionIndexInContract": "13",
                "contract": "626bcb973a67b03f7001c912",
                "copies": 333,
                "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW"
            },
            {
                "_id": "626bc9ad3a67b03f7001c628",
                "name": "Binance-Contract-Col1",
                "collectionIndexInContract": "0",
                "contract": "626bc93f3a67b03f7001c3c4",
                "copies": 3,
                "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW"
            }
        ],
        "tokens": [
            {
                "_id": "6267fca1151f2128b43378f0",
                "metadata": {
                    "name": "Testing-1",
                    "description": "Example description",
                    "artist": "none",
                    "image": "https://gateway.pinata.cloud/ipfs/QmeAJyczgMyZDGepSnMzkhcE98AVA1EFKB6U1n7dn53ui9",
                    "animation_url": "https://rair.mypinata.cloud/ipfs/QmPvFb65dk1o7Upd2sFKDBSBsZwLdTVD5i6nqd9jrBZdss"
                },
                "uniqueIndexInContract": "1",
                "contract": "6267fc4f151f2128b4337383"
            },
            {
                "_id": "6267fca1151f2128b43378fd",
                "metadata": {
                    "name": "Testing-0",
                    "description": "Example description",
                    "artist": "none",
                    "image": "https://gateway.pinata.cloud/ipfs/QmeAJyczgMyZDGepSnMzkhcE98AVA1EFKB6U1n7dn53ui9",
                    "animation_url": "https://rair.mypinata.cloud/ipfs/QmPvFb65dk1o7Upd2sFKDBSBsZwLdTVD5i6nqd9jrBZdss"
                },
                "uniqueIndexInContract": "0",
                "contract": "6267fc4f151f2128b4337383"
            },
            {
                "_id": "6267fca1151f2128b433790a",
                "metadata": {
                    "name": "Testing-0",
                    "description": "Example description",
                    "artist": "none",
                    "image": "https://rair.mypinata.cloud/ipfs/QmbUd8cVY8zygLrrG4qynXjzCZ6WoDwqsib6Knzyb7zAiA/cloneX01.png"
                },
                "uniqueIndexInContract": "2",
                "contract": "6267fc4f151f2128b4337383"
            },
            {
                "_id": "6267fca1151f2128b433792c",
                "metadata": {
                    "name": "Testing-0",
                    "description": "Example description",
                    "artist": "none",
                    "image": "https://gateway.pinata.cloud/ipfs/QmeAJyczgMyZDGepSnMzkhcE98AVA1EFKB6U1n7dn53ui9",
                    "animation_url": "https://rair.mypinata.cloud/ipfs/QmPvFb65dk1o7Upd2sFKDBSBsZwLdTVD5i6nqd9jrBZdss"
                },
                "uniqueIndexInContract": "601",
                "contract": "6267fc4f151f2128b4337383"
            }
        ]
    }
}
```

Error handing to be done.