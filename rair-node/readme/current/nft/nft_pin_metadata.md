# Pin metadata for a single NFT

**URL** : `/api/nft/network/:network/:contractAddress/:product/token/:token/pinning`
**Method** : `POST`

**Parameters**
```json
{
    "network": { "required": true, "content": { "type": "string" } },
    "contractAddress": { "required": true, "content": { "type": "string" } },
    "product": { "required": true, "content": { "type": "string" } },
    "token": { "required": true, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "metadataURI": "https://ipfs.io/ipfs/Qwsx..."
}
```

**Condition** : Contract not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Contract not found" }
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
**Condition** : Token not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Token not found" }
```
**Condition** : User is not the creator of the contract or an admin
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "You have no permissions for updating token ${token}." }
```
**Condition** : Metadata sent is the same as the one in the database
**Code** : `400 BAD REQUEST`
**Content** : 
```json
{ "success": false, "error": true, "message": "Nothing to update." }
```