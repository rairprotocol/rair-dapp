# Generate withdraw hash for current user

**URL** : `/api/credits/withdraw`
**Method** : `POST`

**Body parameters:**
```json
{
    "blockchain": { "type": "string", "required": true },
    "tokenAddress": { "type": "string", "required": true },
    "amount": { "type": "number", "required": true },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "hash": "0xa730920dc29d74e441f492c3..."
}
```

## Error Response

**Condition** : Missing information
**Code** : `400 INVALID REQUEST`
**Content** : 
```json
{ "success": false, "error": true, "message": "Invalid withdraw request" }
```
**Condition** : User balance is less than the requested amount
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "Cannot withdraw that amount" }
```
**Condition** : Missing environment variables needed for withdraw
**Code** : `500 INTERNAL SERVER ERROR`
**Content** : 
```json
{ "success": false, "error": true, "message": "Cannot process withdrawals at the moment" }
```
**Condition** : An error ocurred generating the hash
**Code** : `500 INTERNAL SERVER ERROR`
**Content** : 
```json
{ "success": false, "error": true, "message": "An error has ocurred" }
```
**Condition** : There was no hash generated
**Code** : `500 INTERNAL SERVER ERROR`
**Content** : 
```json
{ "success": false, "error": true, "message": "Invalid signature" }
```