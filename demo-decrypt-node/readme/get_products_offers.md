# Get products with all offers

Find all products with all offers for each of them for particular user

**URL** : `/api/contracts/network/:networkId/:contractAddress/products/offers`

**Method** : `GET`

**Headers:**

```json
{
  "x-rair-token": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

**Parameters:**

```json
{
  "networkId": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "contractAddress": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

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
      "_id": "610d14c03de2f5001dafc429",
      "soldCopies": 3,
      "sold": false,
      "royalty": 0,
      "name": "The Dark Knight",
      "collectionIndexInContract": 1,
      "contract": "contractId",
      "copies": 4,
      "creationDate": "2021-08-06T10:53:52.441Z",
      "offerPool": {
        "_id": "6196842fbf7dc9001c9cea59",
        "marketplaceCatalogIndex": 5,
        "contract": "contractId",
        "product": 0,
        "rangeNumber": 2,
        "minterAddress": "minterAddress",
        "creationDate": "2021-08-06T10:55:00.621Z"
      },
      "offers": [
        {
          "_id": "610d15043de2f5001dafc42e",
          "soldCopies": 2,
          "sold": true,
          "range": [
            0,
            1
          ],
          "offerIndex": 0,
          "contract": "contractId",
          "product": 1,
          "offerPool": 21,
          "price": 111,
          "offerName": "Some Name 1",
          "creationDate": "2021-08-06T10:55:00.621Z",
          "copies": 2
        },
        {
          "_id": "610d15983de2f5001dafc432",
          "soldCopies": 1,
          "sold": false,
          "range": [
            2,
            3
          ],
          "offerIndex": 1,
          "contract": "contractId",
          "product": 1,
          "offerPool": 21,
          "price": 55,
          "offerName": "Some Name 2",
          "creationDate": "2021-08-06T10:57:28.313Z",
          "copies": 2
        }
      ]
    },
    ...
  ]
}
```

## Error Response

**Condition** : If token expired.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "jwt expired"
}
```

OR

**Condition** : If token not valid.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "invalid signature"
}
```

OR

**Condition** : If token not valid.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "jwt malformed"
}
```

OR

**Condition** : If token not provided.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "jwt must be provided"
}
```

OR

**Condition** : If user not found.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "error": true,
  "message": "User with provided Token is not found in database"
}
```
