# Get specific token by contract, product and internal ID

Get specific token by contract, product and internal ID

**URL** : `/api/nft/:contract/:product/token/:token`

**Method** : `GET`

## Success Response

Returns the found token

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "result": {
    "_id": "6138bfef96f6eb001ea02fe0",
    "metadataURI": "none",
    "token": "0",
    "ownerAddress": "ownerAddress",
    "offerPool": 1,
    "offer": 0,
    "contract": "contractAddress",
    "uniqueIndexInContract": 0,
    "creationDate": "2021-09-08T13:51:43.162Z"
  }
}
```
