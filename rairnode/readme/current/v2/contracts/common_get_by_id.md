# Get products for the user

Get <entity> by ID

**URL** : `/api/v2/<entity>s/:id`

**Method** : `GET`

**Parameters:**

```json
{
  "id": {
    "required": true,
    "content": {
      "type": "Schema.ObjectId" //(String)
    }
  },
}
```

## Returns found <entity>

```json
{
    "status": "success",
    "data": {
        "doc": {
            "soldCopies": 0,
            "sold": false,
            "range": [
                "0",
                "22221"
            ],
            "offerName": "Demostream",
            "diamond": true,
            "_id": "626bc7c63a67b03f7001c133",
            "contract": "6267fc52151f2128b43373fe",
            "product": "0",
            "copies": 22222,
            "price": "100000000000000000",
            "diamondRangeIndex": "0",
            "transactionHash": "0xa169da2301643f113f6a0cd10647bc8e4779774cf28ab1551db4c870c9082d8d",
            "creationDate": "2022-04-29T11:11:02.583Z"
        }
    }
}
```

No specific error handling