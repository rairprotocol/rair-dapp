# Get single contract by ID

Get single contract by ID

**URL** : `/api/contracts/singleContract/:contractId`

**Method** : `GET`

**Request parameters:**

```json
{
  "contractId": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

## Success Response

Returns found contract

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true,
  "contract": {
      "_id": "60d0819870a807001c75164d",
      "title": "Some title",
      "contractAddress": "contractAddress",
      "blockchain": "0x61"
    }
}
```
