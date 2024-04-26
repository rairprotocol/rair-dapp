# Update the metadata for all NFTs of a contract with a CSV file

**URL** : `/api/nft/`
**Method** : `POST`

**Body parameters**
```json
{
    "contract": { "required": false, "content": { "type": "string" }},
    "product": { "required": false, "content": { "type": "string" }},
    "forceOverwrite": { "required": false, "content": { "type": "boolean" }},
    "csv": { "required": false, "content": { "type": "file" }},
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{ 
    "success": true,
    "updatedDocuments": 300
}
```

**Condition** : Contract not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Contract not found" }
```
**Condition** : User is not owner of contract
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "User is not owner of contract" }
```
**Condition** : Offers not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Offers not found" }
```
**Condition** : Product not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Product not found" }
```
**Condition** : Offer Pool not found (old contracts only)
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Offer Pool not found" }
```