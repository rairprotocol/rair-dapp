# Get the list of metadata attributes from the tokens inside a product
Search using network and address

**URL** : `/api/nft/network/:network/:contractAddress/:product/attributes`
**Method** : `GET`

**Parameters**
```json
{
    "network": { "required": true, "content": { "type": "string" } },
    "contractAddress": { "required": true, "content": { "type": "string" } },
    "product": { "required": true, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "attributes": {
        "_id": "65a15ec0b43baa02e6d757bc",
        "contract": "64ff440357d24b6bb5e67342",
        "product": 0,
        "attributes": [
            {
                "name": "Rarity",
                "values": [
                    "Coming Soon"
                ],
                "quantity": [
                    84
                ]
            },
            {
                "name": "Test1",
                "values": [
                    "test"
                ],
                "quantity": [
                    84
                ]
            },
            {
                "name": "Test2",
                "values": [
                    "test"
                ],
                "quantity": [
                    84
                ]
            }
        ]
    }
}
```

**Condition** : Contract not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Contract not found" }
```
**Condition** : Product not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Product not found" }
```