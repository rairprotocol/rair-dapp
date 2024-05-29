# Authentication functionality for Web3 wallets and Web3Auth smart accounts

**URL** : `/api/auth/unlock`
**Method** : `POST`

**Body Parameters:**
```json
{
    "type": { "required": true, "content": { "type": "string" } },
    "fileId": { "required": true, "content": { "type": "string" } },
}
```
## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
}
```

## Error Response
**Condition** : Requested video is age protected and user is not age verified
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "Age verification required" }
```
**Condition** : There's no unlocking information about the media file and the file is not a demo
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "No data found for file" }
```
**Condition** : Error during NFT verification
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "Could not verify account: ${account}" }
```
**Condition** : Verification failed
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "Unauthorized" }
```