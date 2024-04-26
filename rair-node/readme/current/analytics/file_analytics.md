# Get analytic data for a media file

**URL** : `/api/analytics/:mediaId`
**Method** : `GET`

**Parameters:**
```json
{
    "mediaId": { "type": "string", "required": true },
}
```

**Query parameters:**
```json
{
  "pageNum": {"required": false, "content": { "type": "number" }},
  "itemsPerPage": {"required": false, "content": {"type": "number"}},
  "userAddress": {"required": false, "content": {"type": "string"}},
  "fromDate": {"required": false, "content": {"type": "date" /*date.toISOString()*/}},
  "toDate":{"required": false, "content": {"type": "date" /*date.toISOString()*/}},
  "onlyCount": {"required": false, "content": {"type": "boolean"}},
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
        {
            "decryptedFiles": 10,
            "userAddress": "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
            "file": "QmSJ5y6TWTj4YJj17EFWwRPGZTQY5UVwBg2Fp8eGDCcnez",
            "createdAt": "2023-01-28T19:25:59.414Z"
        },
        {
            "decryptedFiles": 2,
            "userAddress": "0x26718442011bbeb5449f3c7d296b70940965e77e",
            "file": "QmSJ5y6TWTj4YJj17EFWwRPGZTQY5UVwBg2Fp8eGDCcnez",
            "createdAt": "2023-01-29T19:25:59.414Z"
        },
    ],
    "uniqueAddresses": [
        "0xec30759d0a3f3ce0a730920dc29d74e441f492c3",
        "0x26718442011bbeb5449f3c7d296b70940965e77e"
    ],
    "totalCount": 11
}
```

## Error Response

**Condition** : If the account is not the owner of the file and has no super admin access
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "Invalid user address" }
```
**Condition** : If the media file ID is invalid
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Invalid media Id" }
```