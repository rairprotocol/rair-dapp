# Get offers by contract address and product

**URL** : `/api/v2/offers/byAddressAndProduct/`

**Method** : `GET`

**Query parameters:**

Required query parametrs:
    product - prduct index in contract
    contrac || [contractAddress, networkId]

example: "/api/v2/offers/byAddressAndProduct/?product=0&contract=6267fc52151f2128b43373a1"

[Query param usage details](./common_get_all.md)

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
    "success": true,
    "results": 5,
    "data": {
        "doc": [
            {
                "soldCopies": 3,
                "sold": false,
                "range": [
                    "0",
                    "9"
                ],
                "offerName": "offer-1",
                "diamond": false,
                "_id": "6267fca1151f2128b43378e7",
                "offerIndex": "0",
                "contract": "6267fc4f151f2128b4337383",
                "product": "0",
                "offerPool": "23",
                "copies": 10,
                "price": "10000",
                "transactionHash": "0x8e411d76b440b37676c66336be0959672f95ddb091ec2192ad60e24c872f0fc0",
                "creationDate": "2022-04-26T14:07:29.230Z"
            },
            ...
            {
                "soldCopies": 0,
                "sold": false,
                "range": [
                    "33",
                    "35"
                ],
                "offerName": "offer-3",
                "diamond": false,
                "_id": "6267fca1151f2128b4337934",
                "offerIndex": "2",
                "contract": "6267fc4f151f2128b4337383",
                "product": "0",
                "offerPool": "24",
                "copies": 3,
                "price": "1000",
                "transactionHash": "0x4a64ffdfcc4b129856fa2c9989838eeb43929f6cb0206895792751929f299246",
                "creationDate": "2022-04-26T14:07:29.327Z"
            }
        ]
    }
}
```

*No contract found with contractAddress and networkId provided (will no trigger in case contract provided instead of this tuple)*
```json
{
    "success": false,
    "error": true,
    "message": "No contract found"
}
```
*Product not defined in query parameter*
```json
{
    "success": false,
    "error": true,
    "message": "Missing query parameter product"
}
```
*Not provided contractAddress or networkId*
```json
{
    "success": false,
    "error": true,
    "message": "Cannot find contrcat: missing params"
}
```
*No offers witch has such query params*
```json
{
    "success": false,
    "error": true,
    "message": "No doc found"
}
```