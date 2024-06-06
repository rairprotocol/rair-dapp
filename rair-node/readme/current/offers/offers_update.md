# Update range data
Only sponsored status can be updated, only contract creator or admin can update

**URL** : `/api/offers/:id`
**Method** : `PUT`

**Parameters**
```json
{
    "id": { "required": true, "content": { "type": "string" } },
}
```

**Body Parameters**
```json
{
    "sponsored": { "required": false, "content": { "type": "boolean" } },
    "contract": { "required": false, "content": { "type": "string" } },
    "product": { "required": false, "content": { "type": "string" } },
    "offerPool": { "required": false, "content": { "type": "string" } },
    "copies": { "required": false, "content": { "type": "string" } },
    "soldCopies": { "required": false, "content": { "type": "string" } },
    "sold": { "required": false, "content": { "type": "string" } },
    "price": { "required": false, "content": { "type": "string" } },
    "range": { "required": false, "content": { "type": "string" } },
    "offerName": { "required": false, "content": { "type": "string" } },
    "creationDate": { "required": false, "content": { "type": "string" } },
    "diamond": { "required": false, "content": { "type": "boolean" } },
    "diamondRangeIndex": { "required": false, "content": { "type": "string" } },
    "transactionHash": { "required": false, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
}
```