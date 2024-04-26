# Update the metadata for all NFTs of a contract with a CSV file

**URL** : `/api/nft/pinningMultiple`
**Method** : `POST`

**Body parameters**
```json
{
    "contractId": { "required": false, "content": { "type": "string" }},
    "product": { "required": false, "content": { "type": "string" }},
    "overwritePin": { "required": false, "content": { "type": "boolean" }},
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{ 
    "success": true,
    "CID": "1uc4mFr6Qo046WN6iG...",
    "totalCount": 300
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
**Condition** : User has no permissions for uploading metadata.
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "You have no permissions for uploading metadata." }
```
**Condition** : No tokens found to update
**Code** : `400 BAD REQUEST`
**Content** : 
```json
{ "success": false, "error": true, "message": "No tokens found with unpinned metadata" }
```
**Condition** : Error uploading files to IPFS
**Content** : 
```json
{ "success": false, "error": true, "message": "Error writing file for NFT ##" }
```
