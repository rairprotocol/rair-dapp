# Verify admin user

Verify with a Metamask challenge if the user holds the current Administrator token

**URL** : `/api/analytics/:mediaId`

**Method** : `GET`

**Parameters:**
```json
{
  "mediaId": {
    "type": "string",
    "required": true
  },
}
```

**Query parameters:**
```json
{
  "pageNum": {
    "required": false,
    "content": {
      "type": "number"
    }
  },
  "itemsPerPage": {
    "required": false,
    "content": {
      "type": "number"
    }
  },
  "userAddress": {
    "required": false,
    "content": {
      "type": "string"
    },},
  
  "fromDate": {
    "required": false,
    "content": {
      "type": "date" // date.toISOString()
    },},
  
  "toDate":{ 
    "required": false,
    "content": {
      "type": "date" // date.toISOString()
    },},
  "onlyCount": {
    "required": false,
    "content": {
      "type": "boolean"
    },},
}
```

## Success Response

**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**

```json
{
    "success": true,
    "results": [
        {
            "decryptedFiles": 12,
            "userAddress": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "file": "QmSJ5y6TWTj4YJj17EFWwRPGZTQY5UVwBg2Fp8eGDCcnez",
            "createdAt": "2023-01-27T19:25:59.414Z"
        },
    ],
    "totalCount": 11
}
```

## Error Response

**Condition** : If the account is not the owner of the file
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{
  "success": false,
  "error": true,
  "message": "Invalid user address"
}
```