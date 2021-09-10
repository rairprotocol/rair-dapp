# Get All Product tokens

Get all minted tokens from the product

**URL** : `/api/nft/:contract/:product`

**Method** : `GET`

## Success Response

Returns if found some tokens

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "result": [
    {
      "_id": "6138bfef96f6eb001ea02fe0",
      "metadataURI": "none",
      "token": "0",
      "ownerAddress": "ownerAddress",
      "offerPool": 1,
      "offer": 0,
      "contract": "contractAddress",
      "uniqueIndexInContract": 0,
      "creationDate": "2021-09-08T13:51:43.162Z"
    },
    ...
  ]
}
```
