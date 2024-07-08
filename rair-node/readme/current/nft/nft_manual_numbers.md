# Get the files associated to a product
Search using network and address

**URL** : `/api/nft/network/:network/:contractAddress/:product/files`
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
    "tokens": [
        {
            "token": "0",
            "sold": true
        },
        {
            "token": "1",
            "sold": true
        },
        {
            "token": "2",
            "sold": true
        },
        {
            "token": "3",
            "sold": true
        }
    ]
}
```

**Condition** : Contract or Product not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Data not found" }
```