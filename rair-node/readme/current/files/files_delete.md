# Delete file
Unpins content

**URL** : `/api/files/remove/:mediaId`
**Method** : `DELETE`

**Parameters:**
```json
{
    "id": { "required": true , "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true
}
```