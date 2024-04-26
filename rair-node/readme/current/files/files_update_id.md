# Update file

**URL** : `/api/files/byId/:mediaId`
**Method** : `PUT`

**Parameters:**
```json
{
    "id": { "required": true , "content": { "type": "string" } },
}
```

**Body parameters**
```json
{
    "_id": { "required": false, "content": { "type": "string" }},
    "author": { "required": false, "content": { "type": "string" }},
    "uploader": { "required": false, "content": { "type": "string" }},
    "title": { "required": false, "content": { "type": "string" }},
    "description": { "required": false, "content": { "type": "string" }},
    "contract": { "required": false, "content": { "type": "string" }},
    "product": { "required": false, "content": { "type": "string" }},
    "offer": { "required": false, "content": { "type": "string" }},
    "category": { "required": false, "content": { "type": "string" }},
    "demo": { "required": false, "content": { "type": "string" }},
    "ageRestricted": { "required": false, "content": { "type": "string" }},
    "hidden": { "required": false, "content": { "type": "string" }},
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
**Condition** : Current user isn't the owner of the file
**Code** : `403 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "You don't have permission to manage this data." }
```