# Delete a resale offer

**URL** : `/api/resales/delete/:id`
**Method** : `DELETE`

**Query Parameters**
```json
{
    "id": { "required": false, "content": { "type": "string" } },
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