# Update file

**URL** : `/api/files/update/:mediaId`
**Method** : `PATCH`

**Parameters:**
```json
{
    "id": { "required": true , "content": { "type": "string" } },
}
```

**Body parameters**
```json
{
    "title": { "required": false, "content": { "type": "string" }},
    "description": { "required": false, "content": { "type": "string" }},
    "contract": { "required": false, "content": { "type": "string" }},
    "product": { "required": false, "content": { "type": "string" }},
    "offer": { "required": false, "content": { "type": "string" }},
    "category": { "required": false, "content": { "type": "string" }},
    "demo": { "required": false, "content": { "type": "boolean" }},
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


## Error Response

**Condition** : Invalid file ID
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Data not found" }
```
**Condition** : Current user isn't the owner of the file
**Code** : `403 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "You don't have permission to manage this data." }
```
**Condition** : Error updating the database
**Content** : 
```json
{ "success": false, "error": true, "message": "An error has ocurred" }
```
**Condition** : No changes made
**Content** : 
```json
{ "success": false, "error": true, "message": "Nothing to update" }
```