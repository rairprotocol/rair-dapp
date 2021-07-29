# Get products

Find all products with all offers for eac of them for particular user

**URL** : `/api/products`

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
      "_id": "60fea99f1e2186001db2c880",
      "soldCopies": 0,
      "sold": false,
      "resale": 0,
      "royalty": 0,
      "name": "Product 1.1",
      "collectionIndexInContract": 0,
      "contract": "contractAddress",
      "copies": 1000,
      "creationDate": "2021-07-26T12:25:03.257Z",
      "offers": [
        {
          "_id": "60fea9ea1e2186001db2c882",
          "soldCopies": 10,
          "sold": true,
          "marketplaceCatalogIndex": 29,
          "contract": "contractAddress",
          "product": 0,
          "copies": 10,
          "price": 50,
          "creationDate": "2021-07-26T12:26:18.460Z"
        },
        {
          "_id": "60feaa161e2186001db2c884",
          "soldCopies": 3,
          "sold": false,
          "marketplaceCatalogIndex": 30,
          "contract": "contractAddress",
          "product": 0,
          "copies": 990,
          "price": 20,
          "creationDate": "2021-07-26T12:27:02.618Z"
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
