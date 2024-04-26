# Export analytic data for a media file

**URL** : `/api/analytics/:mediaId/csv`
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
  "userAddress": {"required": false, "content": {"type": "string"}},
  "fromDate": {"required": false, "content": {"type": "date" /*date.toISOString()*/}},
  "toDate":{"required": false, "content": {"type": "date" /*date.toISOString()*/}},
  "onlyCount": {"required": false, "content": {"type": "boolean"}},
}
```

## Success Response
**Code** : `200 OK`
Will return CSV file

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