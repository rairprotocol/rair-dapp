# Get full contracts

Find all <entities>

**URL** : `/api/<entities>/`

**Method** : `GET`

**Query parameters:**

*** Query string ***
Spescial fields: 'page', 'sort', 'limit', 'fields'
  Avoid this naming in models.
Special fields usage: 
  [x] 'fields' - adds projection to the query. Provide list of fileds to limit response to it.
  [x] 'sort' - adds sorting parameter. use like 'price' for asc or '-price' for desc
  [x] 'limit' - number of fields to return, by default is 36, capped at 100
  [x] 'page' - pagination of results used in conjuction with limit. By default shows 1st page, otherr rule 0=1, {<=0} = 1 (do not support 3rd prom the end with -3)
## Success Response

Returns found entity according to it's schema. The dafault projection is full data, this can be limited on model level or in request, depending on security needs.

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
    "status": "success",
    "results": 36,
    "data": {
        "doc": [
            {
                "soldCopies": 0,
                "sold": false,
                "range": [
                    "0",
                    "5"
                ],
                "offerName": "OpSeTe5Col2Ran1",
                "diamond": true,
                "_id": "6267fcd9151f2128b43379cd",
                "contract": "6267fc52151f2128b43373b0",
                "product": "1",
                "copies": 6,
                "price": "500000",
                "diamondRangeIndex": "1",
                "transactionHash": "0x6612f6d21fd8253ff8469841d060d6fec416e02cdd7172bb2d1b1b68ed58e84c",
                "creationDate": "2022-04-26T14:08:25.454Z",
                "offerIndex": "16"
            },
            {
                "soldCopies": 0,
                "sold": false,
                "range": [
                    "0",
                    "1"
                ],
                "offerName": "Diamond-Collection1-Range1",
                "diamond": true,
                "_id": "6267fce1151f2128b43379ed",
                "contract": "6267fc52151f2128b43373b3",
                "product": "0",
                "copies": 2,
                "price": "0",
                "diamondRangeIndex": "0",
                "transactionHash": "0xd3c2630ec2991644efec3088d4b92a4f62dde09bae39a4dad16f789af719a76f",
                "creationDate": "2022-04-26T14:08:33.097Z"
            },
            ...
        ]
    }
}
```
