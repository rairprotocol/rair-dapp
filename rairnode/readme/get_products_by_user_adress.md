# Get products for the user

Get all products for specific contract

**URL** : `/api/v2/products/user/:userAddress`

**Method** : `GET`

**Parameters:**

```json
{
  "userAddress": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
}
```
## Query parameters that are supported:

'page', 'sort', 'limit', 'fields'

fields: projection

sort: field to be sorted with

limit: number of items to return (capped at 100)

page: pagination index starting with 1 (0=1)

## Success Response

Returns found products

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
    "success": true,
    "products": [
        {
            "soldCopies": 0,
            "sold": false,
            "royalty": 0,
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "diamond": false,
            "_id": "629f310cb550f7001d6ee2eb",
            "name": "Mike_test_collection_01_001",
            "collectionIndexInContract": "0",
            "contract": "629f308eb550f7001d6ee2cf",
            "copies": 100,
            "firstTokenIndex": "0",
            "transactionHash": "0xd0ab246e2ed47b46339e65bede9c48c2578fa1babf60c62a2f8e5f7db6a7ee75",
            "creationDate": "2022-06-07T11:05:48.406Z"
        }
    ]
}
```

## Error Response

**Condition** : If contracts not found.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "No contracts exist for the user 0x2c1b196A2Ef816D3Ff5C68F22722Ccv49ea058A42"
}
```
**Condition** : If contracts not found.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "No products exist for the user 0x2c1b196A2Ef816D3Ff5C68F22722Ccv49ea058A42"
}
```