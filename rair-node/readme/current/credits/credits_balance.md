# Get credits balance for current user

**URL** : `/api/credits/:blockchain/:tokenAddress`
**Method** : `GET`

**Parameters:**
```json
{
    "blockchain": { "type": "string", "required": true },
    "tokenAddress": { "type": "string", "required": true },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "credits": "100000"
}
```

## Error Response

**Condition** : User not found or session expired
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "Authentication failed" }
```