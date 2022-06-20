# Get products for the user

Get product by ID

**URL** : `/api/v2/products/:productId`

**Method** : `GET`

**Parameters:**

```json
{
  "productId": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
}
```
## Returns found product

```json
{
    "success": true,
    "product": {
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
}
```

No specific error handling